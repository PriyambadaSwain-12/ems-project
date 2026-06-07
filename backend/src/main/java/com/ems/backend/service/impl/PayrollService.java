package com.ems.backend.service.impl;
import com.ems.backend.dto.request.PayrollRequest;
import com.ems.backend.dto.response.PayrollResponse;
import com.ems.backend.entity.*;
import com.ems.backend.enums.AttendanceStatus;
import com.ems.backend.exception.*;
import com.ems.backend.repository.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class PayrollService {
    private final PayrollRepository payRepo;
    private final EmployeeRepository empRepo;
    private final UserRepository userRepo;
    private final AttendanceRepository attRepo;
    private static final String[] MN={"","January","February","March","April","May","June","July","August","September","October","November","December"};
    public PayrollResponse toResp(Payroll p){
        var emp=p.getEmployee();
        String name=emp!=null&&emp.getUser()!=null?emp.getUser().getName():"Unknown";
        return PayrollResponse.builder().id(p.getId()).employeeId(emp!=null?emp.getId():null)
            .employeeName(name).empCode(emp!=null?emp.getEmpCode():"")
            .departmentName(emp!=null&&emp.getDepartment()!=null?emp.getDepartment().getName():"N/A")
            .designation(emp!=null?emp.getDesignation():"")
            .month(p.getMonth()).year(p.getYear()).basicSalary(p.getBasicSalary()).hra(p.getHra()).da(p.getDa())
            .totalEarnings(p.getTotalEarnings()).pfDeduction(p.getPfDeduction()).taxDeduction(p.getTaxDeduction())
            .lossOfPayDeduction(p.getLossOfPayDeduction()).totalDeductions(p.getTotalDeductions())
            .netSalary(p.getNetSalary()).presentDays(p.getPresentDays()).workingDays(p.getWorkingDays())
            .generatedDate(p.getGeneratedDate()).build();
    }
    private double r(double v){return Math.round(v*100.0)/100.0;}
    public PayrollResponse generate(PayrollRequest req){
        var emp=empRepo.findById(req.getEmployeeId()).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        payRepo.findByEmployeeAndMonthAndYear(emp,req.getMonth(),req.getYear())
            .ifPresent(p->{throw new BadRequestException("Payroll already generated");});
        LocalDate from=LocalDate.of(req.getYear(),req.getMonth(),1),to=from.withDayOfMonth(from.lengthOfMonth());
        int wd=(int)from.datesUntil(to.plusDays(1)).filter(d->d.getDayOfWeek()!=DayOfWeek.SATURDAY&&d.getDayOfWeek()!=DayOfWeek.SUNDAY).count();
        long pf=attRepo.countByEmployeeAndStatusAndDateBetween(emp,AttendanceStatus.PRESENT,from,to);
        long ph=attRepo.countByEmployeeAndStatusAndDateBetween(emp,AttendanceStatus.HALF_DAY,from,to);
        long pl=attRepo.countByEmployeeAndStatusAndDateBetween(emp,AttendanceStatus.LEAVE,from,to);
        int pd=(int)(pf+pl)+(int)(ph/2);
        double basic=emp.getBasicSalary()!=null?emp.getBasicSalary():0.0;
        double hra=r(basic*0.40),da=r(basic*0.20),gross=basic+hra+da;
        int absent=wd-pd;double lop=absent>0?r((basic/wd)*absent):0;
        double pfd=r(basic*0.12),ag=gross*12;
        double tax=ag>1500000?r((ag*0.30)/12):ag>1000000?r((ag*0.20)/12):ag>500000?r((ag*0.10)/12):0;
        double totalDed=pfd+tax+lop,net=r(gross-totalDed);
        var p=payRepo.save(Payroll.builder().employee(emp).month(req.getMonth()).year(req.getYear())
            .basicSalary(basic).hra(hra).da(da).totalEarnings(r(gross)).pfDeduction(pfd).taxDeduction(tax)
            .lossOfPayDeduction(lop).totalDeductions(r(totalDed)).netSalary(net).presentDays(pd).workingDays(wd)
            .generatedDate(LocalDate.now()).build());
        return toResp(p);
    }
    public List<PayrollResponse> getByEmployee(Long id){
        var e=empRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found"));
        return payRepo.findByEmployee(e).stream().map(this::toResp).collect(Collectors.toList());
    }
    public List<PayrollResponse> getByMonth(int m,int y){return payRepo.findByMonthAndYear(m,y).stream().map(this::toResp).collect(Collectors.toList());}
    public PayrollResponse getMine(String email,int m,int y){
        var u=userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        var e=empRepo.findByUser(u).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
        return toResp(payRepo.findByEmployeeAndMonthAndYear(e,m,y).orElseThrow(()->new ResourceNotFoundException("Payroll not found")));
    }
    public byte[] pdf(Long id){
        var p=payRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Not found"));
        var emp=p.getEmployee();
        String name=emp!=null&&emp.getUser()!=null?emp.getUser().getName():"Employee";
        String code=emp!=null?emp.getEmpCode():"";
        String dept=emp!=null&&emp.getDepartment()!=null?emp.getDepartment().getName():"N/A";
        String desig=emp!=null&&emp.getDesignation()!=null?emp.getDesignation():"N/A";
        try(var baos=new ByteArrayOutputStream()){
            var doc=new Document(new PdfDocument(new PdfWriter(baos)));
            doc.add(new Paragraph("EMPLOYEE MANAGEMENT SYSTEM").setBold().setFontSize(18).setTextAlignment(TextAlignment.CENTER).setFontColor(ColorConstants.DARK_GRAY));
            doc.add(new Paragraph("SALARY SLIP — "+MN[p.getMonth()]+" "+p.getYear()).setBold().setFontSize(13).setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph("Generated: "+LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))).setFontSize(10).setTextAlignment(TextAlignment.CENTER).setFontColor(ColorConstants.GRAY));
            doc.add(new Paragraph(" "));
            var info=new Table(UnitValue.createPercentArray(new float[]{1,1})).useAllAvailableWidth();
            info.addCell(new Cell().add(new Paragraph("Employee: "+name).setBold()));info.addCell(new Cell().add(new Paragraph("Code: "+code).setBold()));
            info.addCell(new Cell().add(new Paragraph("Department: "+dept)));info.addCell(new Cell().add(new Paragraph("Designation: "+desig)));
            info.addCell(new Cell().add(new Paragraph("Period: "+MN[p.getMonth()]+" "+p.getYear())));info.addCell(new Cell().add(new Paragraph("Attendance: "+p.getPresentDays()+"/"+p.getWorkingDays()+" days")));
            doc.add(info);doc.add(new Paragraph(" "));
            var sal=new Table(UnitValue.createPercentArray(new float[]{1,1,1,1})).useAllAvailableWidth();
            for(var h:new String[]{"Earnings","Amount (Rs.)","Deductions","Amount (Rs.)"}) sal.addHeaderCell(new Cell().add(new Paragraph(h).setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            String[][] rows={{"Basic Salary",fmt(p.getBasicSalary()),"PF (12%)",fmt(p.getPfDeduction())},{"HRA (40%)",fmt(p.getHra()),"Income Tax",fmt(p.getTaxDeduction())},{"DA (20%)",fmt(p.getDa()),"Loss of Pay",fmt(p.getLossOfPayDeduction())}};
            for(var row:rows)for(var v:row)sal.addCell(v);
            doc.add(sal);doc.add(new Paragraph(" "));
            var net=new Table(UnitValue.createPercentArray(new float[]{1,1,1,1})).useAllAvailableWidth();
            net.addCell(new Cell().add(new Paragraph("Gross Earnings").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            net.addCell(new Cell().add(new Paragraph("Rs. "+fmt(p.getTotalEarnings())).setBold()));
            net.addCell(new Cell().add(new Paragraph("Total Deductions").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            net.addCell(new Cell().add(new Paragraph("Rs. "+fmt(p.getTotalDeductions())).setBold()));
            doc.add(net);doc.add(new Paragraph(" "));
            var ns=new Table(UnitValue.createPercentArray(new float[]{1})).useAllAvailableWidth();
            ns.addCell(new Cell().add(new Paragraph("NET SALARY: Rs. "+fmt(p.getNetSalary())).setBold().setFontSize(15).setTextAlignment(TextAlignment.CENTER)).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            doc.add(ns);
            doc.add(new Paragraph("\nThis is a computer-generated salary slip.").setFontSize(8).setTextAlignment(TextAlignment.CENTER).setItalic().setFontColor(ColorConstants.GRAY));
            doc.close();return baos.toByteArray();
        }catch(Exception ex){throw new RuntimeException("PDF error: "+ex.getMessage());}
    }
    private String fmt(Double v){return v!=null?String.format("%.2f",v):"0.00";}
}

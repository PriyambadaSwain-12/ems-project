package com.ems.backend.exception;
import com.ems.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> notFound(ResourceNotFoundException e){return ResponseEntity.status(404).body(ApiResponse.fail(e.getMessage()));}
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> bad(BadRequestException e){return ResponseEntity.status(400).body(ApiResponse.fail(e.getMessage()));}
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> err(Exception e){return ResponseEntity.status(500).body(ApiResponse.fail("Server error: "+e.getMessage()));}
}

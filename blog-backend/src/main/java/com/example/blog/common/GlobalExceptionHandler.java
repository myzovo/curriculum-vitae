package com.example.blog.common;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(BusinessException.class)
	public R<?> handleBusiness(BusinessException ex) {
		return new R<>(ex.getCode(), ex.getMessage(), null);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public R<?> handleValid(MethodArgumentNotValidException ex) {
		String msg = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
		return R.fail(msg);
	}

	@ExceptionHandler(Exception.class)
	public R<?> handleException(Exception ex) {
		ex.printStackTrace();
		return R.fail("服务器异常: " + ex.getMessage());
	}
}

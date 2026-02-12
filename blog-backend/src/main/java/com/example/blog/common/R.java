package com.example.blog.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一返回结果
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class R<T> {
	private int code;
	private String message;
	private T data;

	public static <T> R<T> ok(T data) {
		return new R<>(200, "success", data);
	}

	public static <T> R<T> ok() {
		return new R<>(200, "success", null);
	}

	public static <T> R<T> fail(String msg) {
		return new R<>(500, msg, null);
	}
}

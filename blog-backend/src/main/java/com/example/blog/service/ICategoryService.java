package com.example.blog.service;

import com.example.blog.entity.Category;

import java.util.List;

public interface ICategoryService {
	Category create(Category category);
	Category update(Category category);
	void delete(Long id);
	Category getById(Long id);
	List<Category> listAll();
}

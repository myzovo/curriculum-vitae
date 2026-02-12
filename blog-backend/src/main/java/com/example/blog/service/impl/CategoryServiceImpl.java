package com.example.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.blog.entity.Category;
import com.example.blog.mapper.CategoryMapper;
import com.example.blog.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryServiceImpl implements ICategoryService {
	@Autowired
	private CategoryMapper categoryMapper;

	@Override
	public Category create(Category category) {
		category.setCreatedAt(LocalDateTime.now());
		category.setUpdatedAt(LocalDateTime.now());
		categoryMapper.insert(category);
		return category;
	}

	@Override
	public Category update(Category category) {
		category.setUpdatedAt(LocalDateTime.now());
		categoryMapper.updateById(category);
		return category;
	}

	@Override
	public void delete(Long id) {
		categoryMapper.deleteById(id);
	}

	@Override
	public Category getById(Long id) {
		return categoryMapper.selectById(id);
	}

	@Override
	public List<Category> listAll() {
		return categoryMapper.selectList(new QueryWrapper<Category>().eq("deleted", 0));
	}
}

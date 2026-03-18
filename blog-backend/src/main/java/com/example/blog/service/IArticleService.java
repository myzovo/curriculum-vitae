package com.example.blog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.entity.Article;

public interface IArticleService {
	Article create(Article article);
	Article update(Article article);
	void delete(Long id, Long operatorId);
	Article getById(Long id);
	Page<Article> page(int pageNum, int pageSize);
	Page<Article> pageByCategory(int pageNum, int pageSize, Long categoryId);

	// 新增的接口方法，匹配实现类
	boolean updateById(Article article);
	boolean removeById(Long id);
}

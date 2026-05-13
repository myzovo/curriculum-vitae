package com.example.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.common.BusinessException;
import com.example.blog.entity.Article;
import com.example.blog.entity.User;
import com.example.blog.mapper.ArticleMapper;
import com.example.blog.mapper.UserMapper;
import com.example.blog.service.IArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;

@Service
public class ArticleServiceImpl implements IArticleService {
	@Autowired
	private ArticleMapper articleMapper;
	@Autowired
	private UserMapper userMapper;

	@Override
	public Article create(Article article) {
		if (article == null) throw new IllegalArgumentException("article is null");
		article.setCreatedAt(LocalDateTime.now());
		article.setUpdatedAt(LocalDateTime.now());
		if (article.getViews() == null) article.setViews(0);
		articleMapper.insert(article);
		return article;
	}

	@Override
	public Article update(Article article) {
		if (article == null || article.getId() == null) throw new IllegalArgumentException("article or id is null");
		article.setUpdatedAt(LocalDateTime.now());
		int rows = articleMapper.updateById(article);
		if (rows > 0) {
			return articleMapper.selectById(article.getId());
		}
		return null;
	}

	@Override
	public void delete(Long id, Long operatorId) {
		if (id == null) return;
		Article existing = articleMapper.selectById(id);
		if (existing == null) {
			throw new BusinessException(404, "文章不存在");
		}
		assertPermission(existing, operatorId);
		articleMapper.deleteById(id);
	}

	// Permission: author or admin (role=1)
	private void assertPermission(Article existing, Long operatorId) {
		if (operatorId == null) {
			throw new BusinessException(401, "未登录，无法操作文章");
		}
		Long ownerId = existing.getAuthorId();
		if (ownerId != null && ownerId.equals(operatorId)) return;
		User op = userMapper.selectById(operatorId);
		if (op != null && op.getRole() != null && op.getRole() == 1) return;
		throw new BusinessException(403, "无权限操作他人文章");
	}

	@Override
	public Article getById(Long id) {
		return articleMapper.selectById(id);
	}

	@Override
	public Page<Article> page(int pageNum, int pageSize) {
		Page<Article> page = new Page<>(pageNum, pageSize);
		QueryWrapper<Article> qw = new QueryWrapper<>();
		qw.eq("deleted", 0).orderByDesc("is_top", "created_at");
		return articleMapper.selectPage(page, qw);
	}

	@Override
	public Page<Article> pageByCategory(int pageNum, int pageSize, Long categoryId) {
		Page<Article> page = new Page<>(pageNum, pageSize);
		QueryWrapper<Article> qw = new QueryWrapper<>();
		qw.eq("deleted", 0);
		if (categoryId != null) qw.eq("category_id", categoryId);
		qw.orderByDesc("is_top", "created_at");
		return articleMapper.selectPage(page, qw);
	}

	@Override
	@Transactional
	public boolean updateById(Article article) {
		if (article == null || article.getId() == null) return false;
		int rows = articleMapper.updateById(article);
		if (rows > 0) {
			return true;
		}
		return false;
	}

	@Override
	@Transactional
	public boolean removeById(Long id) {
		if (id == null) return false;
		int rows = articleMapper.deleteById(id);
		return rows > 0;
	}
}

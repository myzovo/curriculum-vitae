package com.example.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.entity.Comment;
import com.example.blog.mapper.CommentMapper;
import com.example.blog.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CommentServiceImpl implements ICommentService {
	@Autowired
	private CommentMapper commentMapper;

	@Override
	public Comment create(Comment comment) {
		comment.setCreatedAt(LocalDateTime.now());
		comment.setUpdatedAt(LocalDateTime.now());
		commentMapper.insert(comment);
		return comment;
	}

	@Override
	public Page<Comment> pageByArticle(Long articleId, int pageNum, int pageSize) {
		Page<Comment> page = new Page<>(pageNum, pageSize);
		QueryWrapper<Comment> qw = new QueryWrapper<>();
		qw.eq("deleted", 0).eq("article_id", articleId).orderByDesc("created_at");
		return commentMapper.selectPage(page, qw);
	}

	@Override
	public void delete(Long id) {
		commentMapper.deleteById(id);
	}
}

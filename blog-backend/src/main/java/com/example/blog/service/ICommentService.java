package com.example.blog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.entity.Comment;

public interface ICommentService {
	Comment create(Comment comment);
	Page<Comment> pageByArticle(Long articleId, int pageNum, int pageSize);
	void delete(Long id);
}

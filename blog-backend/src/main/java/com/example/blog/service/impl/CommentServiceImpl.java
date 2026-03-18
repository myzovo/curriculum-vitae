package com.example.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.common.BusinessException;
import com.example.blog.entity.Comment;
import com.example.blog.entity.User;
import com.example.blog.mapper.CommentMapper;
import com.example.blog.mapper.UserMapper;
import com.example.blog.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CommentServiceImpl implements ICommentService {
	@Autowired
	private CommentMapper commentMapper;
	@Autowired
	private UserMapper userMapper;

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

	// Update comment content with permission (owner or admin)
	@Override
	public Comment update(Comment comment, Long operatorId) {
		if (comment == null || comment.getId() == null) {
			throw new BusinessException(400, "评论ID不能为空");
		}
		if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
			throw new BusinessException(400, "评论内容不能为空");
		}
		Comment existing = commentMapper.selectById(comment.getId());
		if (existing == null || existing.getDeleted() != null && existing.getDeleted() == 1) {
			throw new BusinessException(404, "评论不存在");
		}
		assertPermission(existing, operatorId);
		existing.setContent(comment.getContent().trim());
		existing.setUpdatedAt(LocalDateTime.now());
		commentMapper.updateById(existing);
		return existing;
	}

	@Override
	public void delete(Long id, Long operatorId) {
		if (id == null) return;
		Comment existing = commentMapper.selectById(id);
		if (existing == null || existing.getDeleted() != null && existing.getDeleted() == 1) {
			throw new BusinessException(404, "评论不存在");
		}
		assertPermission(existing, operatorId);
		commentMapper.deleteById(id);
	}

	// Only comment owner or admin can operate
	private void assertPermission(Comment existing, Long operatorId) {
		if (operatorId == null) {
			throw new BusinessException(401, "未登录，无法操作评论");
		}
		Long ownerId = existing.getUserId();
		if (ownerId != null && ownerId.equals(operatorId)) return;
		User operator = userMapper.selectById(operatorId);
		if (operator != null && operator.getRole() != null && operator.getRole() == 1) return;
		throw new BusinessException(403, "无权限操作他人评论");
	}
}

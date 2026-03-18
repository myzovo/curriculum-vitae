package com.example.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("article")
public class Article {
	@TableId(type = IdType.AUTO)
	private Long id;
	private String title;
	private String content;
	private Long categoryId;
	private Long authorId;
	private Integer isTop; // 1: 置顶
	private Integer deleted; // 0: 未删除, 1: 已删除
	private Integer views; // 新增：阅读量
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }

	public String getContent() { return content; }
	public void setContent(String content) { this.content = content; }

	public Long getCategoryId() { return categoryId; }
	public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

	public Long getAuthorId() { return authorId; }
	public void setAuthorId(Long authorId) { this.authorId = authorId; }

	public Integer getIsTop() { return isTop; }
	public void setIsTop(Integer isTop) { this.isTop = isTop; }

	public Integer getDeleted() { return deleted; }
	public void setDeleted(Integer deleted) { this.deleted = deleted; }

	public Integer getViews() { return views; }
	public void setViews(Integer views) { this.views = views; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public LocalDateTime getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

package com.example.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.common.R;
import com.example.blog.entity.Comment;
import com.example.blog.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private ICommentService commentService;

    @PostMapping
    public R<Comment> create(@RequestBody Comment comment,
                             @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        // attach userId from header when present so that subsequent permission verification is available
        if (userId != null) comment.setUserId(userId);
        return R.ok(commentService.create(comment));
    }

    @GetMapping("/by-article/{articleId}")
    public R<Page<Comment>> pageByArticle(@PathVariable Long articleId,
                                          @RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "10") int size) {
        return R.ok(commentService.pageByArticle(articleId, page, size));
    }

    @PutMapping("/{id}")
    public R<Comment> update(@PathVariable Long id,
                             @RequestBody Comment comment,
                             @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        comment.setId(id);
        return R.ok(commentService.update(comment, userId));
    }

    @DeleteMapping("/{id}")
    public R<?> delete(@PathVariable Long id,
                       @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        commentService.delete(id, userId);
        return R.ok();
    }
}

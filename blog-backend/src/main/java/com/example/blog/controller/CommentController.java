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
    public R<Comment> create(@RequestBody Comment comment) {
        return R.ok(commentService.create(comment));
    }

    @GetMapping("/by-article/{articleId}")
    public R<Page<Comment>> pageByArticle(@PathVariable Long articleId,
                                          @RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "10") int size) {
        return R.ok(commentService.pageByArticle(articleId, page, size));
    }

    @DeleteMapping("/{id}")
    public R<?> delete(@PathVariable Long id) {
        commentService.delete(id);
        return R.ok();
    }
}

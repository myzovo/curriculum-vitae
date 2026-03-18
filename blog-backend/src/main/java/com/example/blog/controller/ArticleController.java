package com.example.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.common.R;
import com.example.blog.entity.Article;
import com.example.blog.service.IArticleService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Resource
    private IArticleService articleService;

    @PostMapping
    public Article create(@RequestBody Article article) {
        return articleService.create(article);
    }

    @PutMapping("/{id}")
    public Article update(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        return articleService.update(article);
    }

    @DeleteMapping("/{id}")
    public R<?> delete(@PathVariable Long id,
                       @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        articleService.delete(id, userId);
        return R.ok();
    }

    @GetMapping("/{id}")
    public Article get(@PathVariable Long id) {
        return articleService.getById(id);
    }

    @GetMapping("/page")
    public Page<Article> page(@RequestParam(defaultValue = "1") int pageNum,
                              @RequestParam(defaultValue = "10") int pageSize) {
        return articleService.page(pageNum, pageSize);
    }

    @GetMapping("/pageByCategory")
    public Page<Article> pageByCategory(@RequestParam(defaultValue = "1") int pageNum,
                                        @RequestParam(defaultValue = "10") int pageSize,
                                        @RequestParam(required = false) Long categoryId) {
        return articleService.pageByCategory(pageNum, pageSize, categoryId);
    }
}

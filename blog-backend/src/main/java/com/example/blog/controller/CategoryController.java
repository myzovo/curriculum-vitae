package com.example.blog.controller;

import com.example.blog.common.R;
import com.example.blog.entity.Category;
import com.example.blog.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private ICategoryService categoryService;

    @PostMapping
    public R<Category> create(@RequestBody Category category) {
        return R.ok(categoryService.create(category));
    }

    @PutMapping("/{id}")
    public R<Category> update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        return R.ok(categoryService.update(category));
    }

    @DeleteMapping("/{id}")
    public R<?> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return R.ok();
    }

    @GetMapping
    public R<List<Category>> list() {
        return R.ok(categoryService.listAll());
    }
}

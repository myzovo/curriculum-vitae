package com.example.blog.controller;

import com.example.blog.common.R;
import com.example.blog.entity.User;
import com.example.blog.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private IUserService userService;

    @GetMapping("/{id}")
    public R<User> get(@PathVariable Long id) {
        return R.ok(userService.getById(id));
    }
}

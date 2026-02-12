package com.example.blog.controller;

import com.example.blog.common.R;
import com.example.blog.entity.User;
import com.example.blog.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private IUserService userService;

    @PostMapping("/register")
    public R<User> register(@Valid @RequestBody User user) {
        User u = userService.register(user);
        return R.ok(u);
    }

    @PostMapping("/login")
    public R<User> login(@RequestBody User user) {
        User u = userService.login(user.getUsername(), user.getPassword());
        return R.ok(u);
    }
}

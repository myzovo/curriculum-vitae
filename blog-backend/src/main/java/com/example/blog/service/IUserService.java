package com.example.blog.service;

import com.example.blog.entity.User;

public interface IUserService {
	User register(User user);
	User login(String username, String password);
	User getById(Long id);
}

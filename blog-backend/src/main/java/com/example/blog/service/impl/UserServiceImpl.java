package com.example.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.blog.common.BusinessException;
import com.example.blog.entity.User;
import com.example.blog.mapper.UserMapper;
import com.example.blog.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements IUserService {
	@Autowired
	private UserMapper userMapper;

	@Override
	public User register(User user) {
		// 检查用户名
		Long count = userMapper.selectCount(new QueryWrapper<User>().eq("username", user.getUsername()));
		if (count != null && count > 0L) {
			throw new BusinessException("用户名已存在");
		}
		// 简单 MD5（注意：生产请使用更安全的哈希）
		String md5 = DigestUtils.md5DigestAsHex(user.getPassword().getBytes(StandardCharsets.UTF_8));
		user.setPassword(md5);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		user.setRole(0);
		user.setStatus(1);
		userMapper.insert(user);
		user.setPassword(null);
		return user;
	}

	@Override
	public User login(String username, String password) {
		User user = userMapper.selectOne(new QueryWrapper<User>().eq("username", username));
		if (user == null) {
			throw new BusinessException("用户不存在");
		}
		String md5 = DigestUtils.md5DigestAsHex(password.getBytes(StandardCharsets.UTF_8));
		if (!md5.equals(user.getPassword())) {
			throw new BusinessException("用户名或密码错误");
		}
		user.setPassword(null);
		return user;
	}

	@Override
	public User getById(Long id) {
		User user = userMapper.selectById(id);
		if (user != null) user.setPassword(null);
		return user;
	}
}

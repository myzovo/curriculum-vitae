package com.example.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@TableName("`user`")
public class User {
	@TableId(type = IdType.AUTO)
	private Long id;
	private String username;
	private String email;
	private String password; // 存储 MD5 后的密码
	private String salt;
	private String avatar;
	private Integer role; // 0 user, 1 admin
	private Integer status;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Integer deleted;
}

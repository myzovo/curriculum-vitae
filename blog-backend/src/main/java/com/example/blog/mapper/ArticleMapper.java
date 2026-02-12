package com.example.blog.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blog.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
	// 可添加自定义方法
    // 与 resources/mapper/ArticleMapper.xml 中的 selectByCategory 对应
    IPage<Article> selectByCategory(IPage<Article> page, @Param("categoryId") Long categoryId);
}

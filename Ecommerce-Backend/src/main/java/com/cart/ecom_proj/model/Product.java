package com.cart.ecom_proj.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private int id;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "brand")
    private String brand;
    @Column(name = "price")
    private BigDecimal price;
    @Column(name = "category")
    private  String category;
    @Column(name = "releaseDate")
    private Date releaseDate;
    @Column(name = "productAvailable")
    private boolean productAvailable;
    @Column(name = "stockQuantity")
    private int stockQuantity;
    @Column(name = "imageName")
    private String imageName;
    @Column(name = "imageType",nullable = true)
    private String imageType;
    @Lob
    @Column(name = "imageDate")
    private Date imageDate;

    public String getImageType(String contentType) {
        return imageType;
    }

    public Date setImageDate(byte[] byteimageDate)
    {
        return imageDate;
    }
}

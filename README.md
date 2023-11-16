# Express ORM (One-to-Many and Many-to-Many)

Express API with basic routes:
* Express
* joi
* sequelize
* mysql2

---
## ABOUT
Berikut ini merupakan API sistem e commerce terdiri dari tabel user, product, review, dan cart. Tabel product dan review memiliki hubungan one-to-many, artinya setiap product dapat memiliki banyak review. Tabel user, product, dan cart memiliki hubungan many-to-many, artinya setiap user dapat memiliki banyak product, dan setiap product dapat dimiliki oleh banyak user. Tabel cart berfungsi sebagai penghubung antara tabel user dan product.
## URL
SERVER
```
http://localhost:3000
```
LIST ENTITIES
1. [Product](#Product)
2. [Review](#Review)
3. [User](#User)
4. [Cart](#Cart)
---

## Global Response

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```
_Response (404 - Not Found)_
```
{
    "message": "API not found"
}
```
---
# RESTful endpoints

## PRODUCT
### GET ALL PRODUCTS
Example
```
localhost:3000/api/product
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": [
        {
            "id": 2,
            "title": "Baju Koas Hitam",
            "description": "Estimasi ukuran : allsize fit m -l 50x72cm READY STOCK ( no po ) BARANG YANG HABIS AKAN SEGERA KITA DELETE",
            "price": 50000,
            "quantity": 21,
            "productReview": [
                {
                    "id": 2,
                    "rating": 4.8,
                    "content": "Mendarat dengan aman, bagus sekali",
                    "productId": 2
                },
                {
                    "id": 4,
                    "rating": 4.8,
                    "content": "Mendarat dengan aman kedua, bagus sekali",
                    "productId": 2
                }
            ]
        },
        {
            "id": 4,
            "title": "Pedang Minecraft / Minecraft Sword",
            "description": "Minecraft Diamond Sword size : 61 cm x 30 cm x 1.4 cm Material : EVA Foam",
            "price": 62000,
            "quantity": 9,
            "productReview": [
                {
                    "id": 7,
                    "rating": 3.9,
                    "content": "Barang bagus sekali, tapi ada lecet",
                    "productId": 4
                }
            ]
        },
        {
            "id": 1,
            "title": "iPhone 14 Pro Max 126 GB",
            "description": "test test testtest test testtesttesttesttest test testtest test testtesttest",
            "price": 12000,
            "quantity": 10,
            "productReview": []
        }
    ],
    "message": "Success get all products"
}
```
---
### GET PRODUCT BY ID
Example
```
localhost:3000/api/product/2
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": {
        "id": 2,
        "title": "Baju Koas Hitam",
        "description": "Estimasi ukuran : allsize fit m -l 50x72cm READY STOCK ( no po ) BARANG YANG HABIS AKAN SEGERA KITA DELETE",
        "price": 50000,
        "quantity": 21,
        "productReview": [
            {
                "id": 2,
                "rating": 4.8,
                "content": "Mendarat dengan aman, bagus sekali",
                "productId": 2
            },
            {
                "id": 4,
                "rating": 4.8,
                "content": "Mendarat dengan aman kedua, bagus sekali",
                "productId": 2
            }
        ]
    },
    "message": "Success get product by id"
}
```
_Response (404)_
```
{
    "message": "Product not found"
}
```
---
### CREATE PRODUCT (POST)
Example
```
localhost:3000/api/product
```

_Request Header_
```
not needed
```

_Request Body_
```
{
    "title": "Tas Ransel Anak",
    "description": "Material Utama : PVC (tahan air) Dimensi : 25*20*8 Berat : 200gram",
    "price": 95000,
    "quantity": 12
}
```

_Response (200)_
```
{
    "data": {
        "id": 7,
        "title": "Tas Ransel Anak",
        "description": "Material Utama : PVC (tahan air) Dimensi : 25*20*8 Berat : 200gram",
        "price": 95000,
        "quantity": 12
    },
    "message": "Product created successfully"
}
```
_Response (400)_ -> All field required and then description must more than 20 characters, quantity min 1, and price min 1000
```
{
    "status": "Validation Failed",
    "message": "\"description\" length must be at least 20 characters long"
}
```
---
### UPDATE PRODUCT (/api/product/:id)
Example
```
localhost:3000/api/product/7
```

_Request Header_
```
not needed
```

_Request Body_
```
{
    "title": "Tas Ransel Anak Updated",
    "description": "Deskripsi minimal 20 kata updated"
}
```
_Response (200)_
```
{
    "data": {
        "id": 7,
        "title": "Tas Ransel Anak Updated",
        "description": "Deskripsi minimal 20 kata updated",
        "price": 95000,
        "quantity": 12
    },
    "message": "Product updated successfully"
}
```
_Response (400)_ -> All field not required for update, but each attributes has own validation
```
{
    "status": "Validation Failed",
    "message": "\"price\" must be a number"
}
```
_Response (404)_
```
{
    "message": "Product not found"
}
```
---
### DELETE PRODUCT (/api/product/:id)
Example
```
localhost:3000/api/product/7
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```
_Response (200)_
```
{
    "message": "Successfully delete product!"
}
```
_Response (404)_
```
{
    "message": "Product not found"
}
```
---

## REVIEW
### CREATE REVIEW (/api/review/product/:productId)
Example
```
localhost:3000/api/review/product/4
```

_Request Header_
```
not needed
```

_Request Body_
```
{
    "rating": 4.1,
    "content": "Barang bagus sekali, tapi ada lecet sedikit"
}
```

_Response (200)_
```
{
    "data": {
        "id": 8,
        "productId": 4,
        "rating": 4.1,
        "content": "Barang bagus sekali, tapi ada lecet sedikit"
    },
    "message": "Success create review"
}
```
_Response (400)_ -> All field required and then rating must be number
```
{
    "status": "Validation Failed",
    "message": "\"content\" is not allowed to be empty"
}
```
_Response (404)_
```
{
    "message": "Product not found"
}
```
---
### GET ALL REVIEW (/api/review)
Example
```
localhost:3000/api/review
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": [
        {
            "id": 6,
            "rating": 4.6,
            "content": "Mendarat dengan aman keem, bagus sekali",
            "productId": 2
        },
        {
            "id": 7,
            "rating": 3.9,
            "content": "Barang bagus sekali, tapi ada lecet",
            "productId": 4
        },
        {
            "id": 8,
            "rating": 4.1,
            "content": "Barang bagus sekali, tapi ada lecet sedikit",
            "productId": 4
        }
    ],
    "message": "Success get all reviews"
}
```
---
### DELETE PRODUCT (/api/review/:id)
Example
```
localhost:3000/api/product/8
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```
_Response (200)_
```
{
    "message": "Review has beed deleted!"
}
```
_Response (404)_
```
{
    "message": "Review not found"
}
```
---

## USER
### CREATE USER (/api/user)
Example
```
localhost:3000/api/user
```

_Request Header_
```
not needed
```

_Request Body_
```
{
    "name": "taufiq 3",
    "email": "taufiq_3@gmail.com"
}
```

_Response (200)_
```
{
    "data": {
        "id": 3,
        "name": "taufiq 3",
        "email": "taufiq_3@gmail.com",
        "updatedAt": "2023-11-16T02:38:21.762Z",
        "createdAt": "2023-11-16T02:38:21.762Z"
    },
    "message": "User created successfully"
}
```
_Response (400)_
```
{
    "message": "Email already exists"
}
```
_Response (400)_ -> All field required
```
{
    "status": "Validation Failed",
    "message": "\"name\" is not allowed to be empty"
}
```
---
### GET USER BY ID (/api/user/:id)
Example
```
localhost:3000/api/user/1
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": {
        "id": 1,
        "name": "taufiq",
        "email": "taufiq@gmail.com",
        "productInCart": [
            {
                "id": 3,
                "userId": 1,
                "productId": 3,
                "productName": "Action Figure Luffy Gear 5",
                "price": "160000",
                "quantity": 3
            }
        ]
    },
    "message": "Success get user by id"
}
```
_Response (404)_
```
{
    "message": "User not found"
}
```
---
### GET ALL USER (/api/user)
Example
```
localhost:3000/api/user
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": [
        {
            "id": 2,
            "name": "taufiq 2",
            "email": "taufiq_2@gmail.com",
            "productInCart": [
                {
                    "id": 1,
                    "userId": 2,
                    "productId": 3,
                    "productName": "Action Figure Luffy Gear 5",
                    "price": "80000",
                    "quantity": 1
                },
                {
                    "id": 2,
                    "userId": 2,
                    "productId": 2,
                    "productName": "Baju Koas Hitam",
                    "price": "50000",
                    "quantity": 1
                }
            ]
        },
        {
            "id": 1,
            "name": "taufiq",
            "email": "taufiq@gmail.com",
            "productInCart": [
                {
                    "id": 3,
                    "userId": 1,
                    "productId": 3,
                    "productName": "Action Figure Luffy Gear 5",
                    "price": "160000",
                    "quantity": 3
                }
            ]
        },
        {
            "id": 4,
            "name": "taufiq 3",
            "email": "taufiq_3@gmail.com",
            "productInCart": []
        }
    ],
    "message": "Successfully get all users"
}
```
---
### DELETE USER (/api/user/:id)
Example
```
localhost:3000/api/user/4
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```
_Response (200)_
```
{
    "message": "Successfully delete data!"
}
```
_Response (404)_
```
{
    "message": "User not found"
}
```
---
## CART
### ADD PRODUCT TO CART (/api/user/:userId/product/:productId)
Example
```
localhost:3000/api/user/1/product/3
```

_Request Header_
```
not needed
```

_Request Body_
```
{
    "quantity": 2
}
```

_Response (200)_ -> price is productPrice * quantity
```
{
    "message": "Product added to cart successfully",
    "data": {
        "id": 3,
        "userId": 1,
        "productId": 3,
        "productName": "Action Figure Luffy Gear 5",
        "price": "160000",
        "quantity": 2,
        "updatedAt": "2023-11-16T04:11:39.676Z"
    }
}
```
_Response (400)_
```
{
    "status": "Validation Failed",
    "message": "\"quantity\" must be a number"
}
```
_Response (400)_ if request quantity > product quantity
```
{
    "message": "Please adjust the quantity and try again"
}
```
_Response (404)_
```
{
    "message": "User or product not found"
}
```
---
### DELETE PRODUCT FROM CART (/api/user/:userId/product/:productId)
Example
```
localhost:3000/api/user/1/product/3
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "message": "Product removed from cart successfully"
}
```
_Response (404)_
```
{
    "message": "Product not found in cart"
}
```
_Response (404)_
```
{
    "message": "User or product not found"
}
```
---


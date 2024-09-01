"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerComponent: React.FC = () => {
  const spec = `
openapi: 3.0.3
info:
  title: Product and Market API
  version: 1.0.0
  description: API for managing products, handling market requests, and user management

paths:
  /api/backend/addProduct:
    post:
      summary: Add a new product
      operationId: addProduct
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Name of the product
                  minLength: 1
                description:
                  type: string
                  description: Description of the product
                  minLength: 1
                priceInCents:
                  type: integer
                  description: Price of the product in cents
                  minimum: 1
                file:
                  type: string
                  format: binary
                  description: The file associated with the product
                image:
                  type: string
                  format: binary
                  description: The image associated with the product
              required:
                - name
                - description
                - priceInCents
                - file
                - image
      responses:
        '200':
          description: Product added successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                type: object
                properties:
                  errors:
                    type: object
                    description: Details of the validation errors
                    additionalProperties:
                      type: array
                      items:
                        type: string
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Failed to add product
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForProducts
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/chatMarketRequest:
    get:
      summary: Fetch market-related information based on a query
      operationId: chatMarketRequest
      parameters:
        - in: query
          name: question
          schema:
            type: string
          required: true
          description: User's query to search the market
      responses:
        '200':
          description: Query results fetched successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: string
                    description: Response content
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid input
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: string
                    example: ""
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForChatMarketRequest
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/deleteOrder:
    delete:
      summary: Delete an order by ID
      operationId: deleteOrder
      parameters:
        - in: query
          name: id
          schema:
            type: string
          required: true
          description: ID of the order to be deleted
      responses:
        '200':
          description: Order deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: ID of the deleted order
        '400':
          description: Invalid ID
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid ID
        '404':
          description: Order not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Order not found
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForDeleteOrder
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/deleteProduct:
    delete:
      summary: Delete a product by ID
      operationId: deleteProduct
      parameters:
        - in: query
          name: id
          schema:
            type: string
          required: true
          description: ID of the product to be deleted
      responses:
        '200':
          description: Product deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
        '400':
          description: Invalid ID
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid ID
        '404':
          description: Product not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Product not found
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForDeleteProduct
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/deleteUser:
    delete:
      summary: Delete a user by ID
      operationId: deleteUser
      parameters:
        - in: query
          name: id
          schema:
            type: string
          required: true
          description: ID of the user to be deleted
      responses:
        '200':
          description: User deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  user:
                    type: object
                    properties:
                      id:
                        type: string
                        description: ID of the deleted user
        '400':
          description: Invalid ID
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid ID
        '404':
          description: User not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: User not found
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForDeleteUser
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/getProductData:
    get:
      summary: Retrieve product counts
      operationId: getProduct
      responses:
        '200':
          description: Product counts fetched successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  activeCount:
                    type: integer
                    description: Number of active products
                  inactiveCount:
                    type: integer
                    description: Number of inactive products
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForGetProduct
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/getSalesData:
    get:
      summary: Retrieve aggregated sales data
      operationId: getSalesData
      responses:
        '200':
          description: Sales data fetched successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: number
                    format: float
                    description: Total sales amount in dollars
                  numberOfSales:
                    type: integer
                    description: Number of sales
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForGetSalesData
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/getUserData:
    get:
      summary: Retrieve user and order data
      operationId: getUserData
      responses:
        '200':
          description: User and order data fetched successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  userCount:
                    type: integer
                    description: Total number of users
                  averageValuePerUser:
                    type: number
                    format: float
                    description: Average value of orders per user in dollars
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForGetUserData
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/toggleProductAvailability:
    post:
      summary: Toggle product availability
      operationId: toggleProductAvailability
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: ID of the product
                isAvailableForPurchase:
                  type: boolean
                  description: Product availability status
              required:
                - id
                - isAvailableForPurchase
      responses:
        '200':
          description: Product availability toggled successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid input
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForToggleProductAvailability
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed

  /api/backend/updateProduct:
    post:
      summary: Update an existing product
      operationId: updateProduct
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: ID of the product
                name:
                  type: string
                  description: Name of the product
                  minLength: 1
                description:
                  type: string
                  description: Description of the product
                  minLength: 1
                priceInCents:
                  type: integer
                  description: Price of the product in cents
                  minimum: 1
                file:
                  type: string
                  format: binary
                  description: The file associated with the product (optional)
                image:
                  type: string
                  format: binary
                  description: The image associated with the product (optional)
              required:
                - id
                - name
                - description
                - priceInCents
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                type: object
                properties:
                  errors:
                    type: object
                    description: Details of the validation errors
                    additionalProperties:
                      type: array
                      items:
                        type: string
        '404':
          description: Product not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Product not found
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Internal server error
    options:
      summary: Handle OPTIONS method
      operationId: handleOptionsForUpdateProduct
      responses:
        '405':
          description: Method not allowed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Method not allowed
`;

  return <SwaggerUI spec={spec} />;
};

export default SwaggerComponent;

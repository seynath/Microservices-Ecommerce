const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the .proto file (this file is used to define the gRPC services)
const PROTO_PATH = path.join(__dirname, 'proto/category.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const categoryProto = grpc.loadPackageDefinition(packageDefinition).category;

// Create a gRPC client for CategoryService
const client = new categoryProto.CategoryService(
  'localhost:50051', // Address of the gRPC server in the Category service
  grpc.credentials.createInsecure()
);

// gRPC method to get category by ID
const getCategoryById = (categoryId) => {
  return new Promise((resolve, reject) => {
    client.GetCategory({ categoryId }, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response.category);
    });
  });
};

// gRPC method to get sub-category by ID
const getSubCategoryById = (categoryId, subCategoryId) => {
  return new Promise((resolve, reject) => {
    client.GetSubCategory({ categoryId, subCategoryId }, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response.subCategory);
    });
  });
};

module.exports = { getCategoryById, getSubCategoryById };

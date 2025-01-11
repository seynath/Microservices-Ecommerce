const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


const CATEGORY_GRPC_ADDRESS = process.env.CATEGORY_GRPC_ADDRESS;
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
  CATEGORY_GRPC_ADDRESS, // Address of the gRPC server in the Category service
  // 'localhost:50051', // Address of the gRPC server in the Category service
  grpc.credentials.createInsecure()
);


// Fetch all categories via gRPC
const getAllCategories = async () => {
  return new Promise((resolve, reject) => {
    client.getAllCategories({}, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response.categories); // Assuming response contains an array of categories
    });
  });
};


const getAllSubCategories = async () => {
  return new Promise((resolve, reject) => {
    grpcClient.getAllSubCategories({}, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response.subCategories); // Assuming response contains an array of subcategories
    });
  });
};

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
module.exports = { getAllCategories, getAllSubCategories, getCategoryById };

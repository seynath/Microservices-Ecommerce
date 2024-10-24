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


// Fetch all categories via gRPC
const getAllCategories = async () => {
  return new Promise((resolve, reject) => {
    grpcClient.getAllCategories({}, (error, response) => {
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
module.exports = { getAllCategories, getAllSubCategories };

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const Category = require('./models/Category'); // Your Category model
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Load the .proto file
const PROTO_PATH = path.join(__dirname, 'proto/category.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const categoryProto = grpc.loadPackageDefinition(packageDefinition).category;


// Implement gRPC service methods
const getCategory = async (call, callback) => {
  const { categoryId } = call.request;
  
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'Category not found',
      });
    }

    // Send category details as response
    callback(null, { category });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: error.message,
    });
  }
};


const getSubCategory = async (call, callback) => {
  const { categoryId, subCategoryId } = call.request;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'Category not found',
      });
    }

    const subCategory = category.subCategories.find(subCat => subCat._id.toString() === subCategoryId);
    if (!subCategory) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'Sub-category not found',
      });
    }

    // Send sub-category details as response
    callback(null, { subCategory });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: error.message,
    });
  }
};

const getAllCategories = async (call, callback) => {
  try {
    const categories = await Category.find().populate('subCategories');
    // console.log(categories);
    // categories.forEach(category => {
      //   console.log(category.subCategories);
      // });
      
      const categoryList = categories.map((cat) => ({
        _id: cat._id.toString(),
        name: cat.name,
        description: cat.description,
        image: cat.image,
        subCategories: cat.subCategories.map((subCat) => ({
          _id: subCat._id.toString(),
          name: subCat.name,
          description: subCat.description,
          image: subCat.image,
        }))
      }));
      console.log("//////////");
      console.log("//////////");
      console.log(categoryList);
      console.log("//////////");
    callback(null, { categories: categoryList });
  } catch (error) {
    // callback(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

// Define the gRPC server
const startGrpcServer = () => {
  const server = new grpc.Server();

  // Add the CategoryService to the gRPC server
  server.addService(categoryProto.CategoryService.service, {
    GetCategory: getCategory,
    GetSubCategory: getSubCategory,
    GetAllCategories: getAllCategories,
  });

  const port = process.env.CATEGORY_GRPC_ADDRESS_PORT || 50051;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
      return;
    }

    console.log(`gRPC server running on port ${port}`);
    server.start();
  });
};

module.exports = startGrpcServer;

-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: myshop
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(20) NOT NULL,
  PRIMARY KEY (`branch_id`),
  UNIQUE KEY `branch_name` (`branch_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Gampaha'),(2,'Ganemulla');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bulk`
--

DROP TABLE IF EXISTS `bulk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulk` (
  `bulk_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`bulk_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bulk_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulk`
--

LOCK TABLES `bulk` WRITE;
/*!40000 ALTER TABLE `bulk` DISABLE KEYS */;
INSERT INTO `bulk` VALUES (2,22,'2024-06-09 05:13:30','Invoice Sent'),(3,22,'2024-06-09 06:16:27','Paid'),(4,22,'2024-06-09 07:56:56','Pending');
/*!40000 ALTER TABLE `bulk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bulk_items`
--

DROP TABLE IF EXISTS `bulk_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulk_items` (
  `bulk_item_id` int NOT NULL AUTO_INCREMENT,
  `bulk_id` int NOT NULL,
  `product_id` smallint NOT NULL,
  `color_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_id` smallint NOT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`bulk_item_id`),
  KEY `bulk_id` (`bulk_id`),
  KEY `product_id` (`product_id`),
  KEY `color_code` (`color_code`),
  KEY `size_id` (`size_id`),
  CONSTRAINT `bulk_items_ibfk_1` FOREIGN KEY (`bulk_id`) REFERENCES `bulk` (`bulk_id`),
  CONSTRAINT `bulk_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`p_id`),
  CONSTRAINT `bulk_items_ibfk_3` FOREIGN KEY (`color_code`) REFERENCES `color` (`col_code`),
  CONSTRAINT `bulk_items_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulk_items`
--

LOCK TABLES `bulk_items` WRITE;
/*!40000 ALTER TABLE `bulk_items` DISABLE KEYS */;
INSERT INTO `bulk_items` VALUES (1,2,106,'#640202',5,3),(2,2,106,'#7d7d7d',5,3),(3,3,102,'#00ff40',5,3),(4,3,102,'#a600ff',6,2),(5,4,108,'#3700ff',6,25);
/*!40000 ALTER TABLE `bulk_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` smallint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,12,'2024-04-18 18:39:03','2024-04-18 18:39:03'),(2,17,'2024-04-20 08:10:52','2024-04-20 08:10:52'),(3,18,'2024-05-06 14:34:01','2024-05-06 14:34:01'),(4,19,'2024-05-08 12:13:21','2024-05-08 12:13:21'),(5,20,'2024-05-12 14:35:13','2024-05-12 14:35:13'),(6,21,'2024-05-12 14:39:45','2024-05-12 14:39:45'),(7,22,'2024-05-28 13:58:15','2024-05-28 13:58:15'),(8,23,'2024-05-29 07:30:31','2024-05-29 07:30:31'),(9,24,'2024-05-29 08:15:55','2024-05-29 08:15:55'),(10,25,'2024-05-30 08:15:01','2024-05-30 08:15:01'),(11,26,'2024-05-30 08:32:34','2024-05-30 08:32:34'),(12,27,'2024-05-30 08:34:08','2024-05-30 08:34:08'),(15,40,'2024-06-09 16:46:13','2024-06-09 16:46:13'),(16,41,'2024-06-09 16:51:03','2024-06-09 16:51:03'),(17,42,'2024-06-09 16:51:46','2024-06-09 16:51:46'),(18,43,'2024-06-13 14:33:06','2024-06-13 14:33:06'),(19,44,'2024-06-14 02:53:25','2024-06-14 02:53:25');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` smallint NOT NULL AUTO_INCREMENT,
  `cart_id` smallint NOT NULL,
  `size_color_quantity_id` int NOT NULL,
  `product_total` decimal(8,2) DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `fk_c_c_id` (`cart_id`),
  KEY `fkcart_items_size_color_quantity_id` (`size_color_quantity_id`),
  CONSTRAINT `fk_c_c_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkcart_items_size_color_quantity_id` FOREIGN KEY (`size_color_quantity_id`) REFERENCES `size_color_quantity` (`size_color_quantity_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (124,2,122,1500.00,1),(125,2,130,1500.00,1),(126,2,146,500.00,0);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (9,'Women\'s Tops'),(11,'Women\'s Jeans'),(12,'Women\'s Skirts'),(13,'Women\'s Shorts'),(15,'Men\'s T-Shirts'),(16,'Men\'s Tshirt');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `col_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `col_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`col_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES ('#000000','Black'),('#00ff40','Green'),('#0affe2','Cyan'),('#3700ff','Blue'),('#640202','Brown'),('#7d7d7d','Gray'),('#a600ff','Violet'),('#ff0000','Red'),('#ff00ae','Pink'),('#ff8800','Orange'),('#fff700','Yellow'),('#ffffff','White');
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry`
--

DROP TABLE IF EXISTS `enquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry` (
  `enquiry_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `enquiry_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Submitted',
  PRIMARY KEY (`enquiry_id`),
  KEY `enquiry_order` (`order_id`),
  CONSTRAINT `enquiry_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry`
--

LOCK TABLES `enquiry` WRITE;
/*!40000 ALTER TABLE `enquiry` DISABLE KEYS */;
INSERT INTO `enquiry` VALUES (11,66,'is it coming?','2024-06-01 20:13:17','Resolved'),(12,75,'when this will come?','2024-06-03 06:03:19','Submitted'),(13,75,'its not came','2024-06-03 06:04:01','Contacted'),(15,89,'hi','2024-06-05 11:13:28','Submitted'),(16,93,'jlonath','2024-06-11 16:08:22','Submitted'),(17,94,'why this is late?','2024-06-12 03:19:49','Resolved'),(18,94,'thnaks for the refund','2024-06-12 03:22:15','Resolved'),(20,90,'hihi','2024-06-12 08:30:50','Submitted'),(21,93,'jlo 123','2024-06-12 09:32:08','Contacted'),(22,98,'When this is come?','2024-06-13 14:37:07','Contacted'),(23,99,'when will this come?','2024-06-14 02:36:25','Submitted'),(24,100,'why is this late?','2024-06-14 05:40:23','Submitted');
/*!40000 ALTER TABLE `enquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `image_id` smallint NOT NULL AUTO_INCREMENT,
  `image_link` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` smallint NOT NULL,
  `asset_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `fk_image_id` (`product_id`),
  CONSTRAINT `fk_image_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (100,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717526111/yepgx9s6dd7073apwqpq.jpg',105,'308224723a7fbb938b87fab88e55e303','yepgx9s6dd7073apwqpq'),(101,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717526113/voukkqvmqht8s1vj3udh.jpg',105,'4ba4e9404af80b016666a564d33eab12','voukkqvmqht8s1vj3udh'),(105,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717558170/qegxhogecnljxab3mi6v.jpg',106,'aa15acb73d7e97b7494af75b0647624a','qegxhogecnljxab3mi6v'),(106,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717558171/t6iv8la1g6snet8morfg.jpg',106,'ea5a897c692428613ff3637414d9a591','t6iv8la1g6snet8morfg'),(107,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717558171/iwsfin3cwi4givkvg7oc.jpg',106,'62cbdd981d1e905eeb96a3abc772a0ab','iwsfin3cwi4givkvg7oc'),(113,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717658413/gewjmix9bkcnclxcyyv0.jpg',109,'30326d06ded4e9a392beb3e1f3693335','gewjmix9bkcnclxcyyv0'),(124,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717837865/fp6uvy7ltxqbzys8z08t.jpg',102,'c7544f67643bb25560b30a1ecb244679','fp6uvy7ltxqbzys8z08t'),(125,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717837866/ygvztaj7hyuhcdptrl4c.jpg',102,'28ecc57e6fb184de26f409595a16c13d','ygvztaj7hyuhcdptrl4c'),(126,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1717837867/eqawcidlrrrxc4eunapn.jpg',102,'b104a1799775a8b3526070517d7456ba','eqawcidlrrrxc4eunapn'),(131,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1718289645/fq51z9l4dqeruiqybx9n.jpg',111,'9a01fa3f0b05af079941b7025f16338d','fq51z9l4dqeruiqybx9n'),(132,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1718331922/piuutmffdaetqdggnbam.jpg',108,'930011cc215553dfbea10f1b6b945a02','piuutmffdaetqdggnbam'),(133,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1718331945/f9if3nrvrxzlqqi0stln.jpg',107,'b39c612672334ee3556a9a943c105768','f9if3nrvrxzlqqi0stln'),(134,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1718331980/j4subziomon8xtuqzrno.avif',110,'4fb2067008ae5affce7014d22c59ace5','j4subziomon8xtuqzrno'),(135,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1718343823/dxabhvhqvck0bzmcqrd5.png',112,'5f26f5308a366a8ae55c49d4080ba56f','dxabhvhqvck0bzmcqrd5'),(136,'https://res.cloudinary.com/dzqihtcs4/image/upload/v1718343824/gtorkamkvtvk92dlh5xn.png',112,'97ad9913b42682f73b4e39a1c7866e44','gtorkamkvtvk92dlh5xn');
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `size_color_quantity_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_order_size_color_quantity_id` (`size_color_quantity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (80,66,145,3),(81,67,145,2),(82,67,130,5),(83,68,122,1),(84,69,143,1),(85,70,144,1),(86,71,146,2),(87,72,125,1),(88,73,127,2),(89,74,143,1),(90,75,126,1),(91,76,126,1),(92,77,146,1),(93,80,146,1),(94,81,148,1),(95,81,122,1),(96,83,122,1),(97,84,146,2),(98,85,146,1),(99,86,150,2),(100,87,149,1),(101,88,150,1),(102,89,150,1),(103,89,148,1),(104,90,149,4),(105,90,123,1),(106,91,122,1),(107,92,146,2),(108,92,153,2),(109,93,128,2),(110,94,128,2),(111,95,122,1),(112,96,150,1),(113,97,146,2),(114,97,122,1),(115,98,125,2),(116,98,150,1),(117,99,122,2),(118,100,122,2);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` int NOT NULL,
  `order_status` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_apt_no` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_city` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_state` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_zip` int NOT NULL,
  `shipping_country` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_apt_no` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_city` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_state` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_zip` int NOT NULL,
  `billing_country` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(9,2) DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `fk_order_user_id` (`user_id`),
  CONSTRAINT `fk_order_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (66,22,'','','Cash ','thenura-im20102@stu.kln.ac.lk',786068119,'delivered','large 3','7','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx','4gt4etve','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx',2100.00,'2024-05-30 16:32:57'),(67,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','super','77','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx','4gt4etve','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx',8900.00,'2024-05-31 16:42:26'),(68,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','good','45','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx','4645','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx',1500.00,'2024-06-02 05:11:45'),(69,22,'yeha','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','hurry up','3563','425/27/A,11 Lane Mahawatta','Ganemulla','western',11020,'xxx','345','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx',600.00,'2024-06-02 05:14:32'),(70,22,'lplp','knn','COD','vbjhbjg@stu.kln.ac.lk',786068119,'Processing','ji','343','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx','23','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx',500.00,'2024-06-02 07:38:20'),(71,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','wrap it','jon','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx','4645','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'xxx',1000.00,'2024-06-02 12:29:44'),(72,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','','888','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx','45','425/27/A,11 Lane Mahawatta','Ganemulla','uva',11020,'xxx',1500.00,'2024-06-02 12:55:53'),(73,22,'last','one','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','oiuyt','65667','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx','4645','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx',3000.00,'2024-06-02 13:09:44'),(74,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','hhh','fc','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx','2452','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx',600.00,'2024-06-02 13:13:11'),(75,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','ewsws','dee','425/27/A,11 Lane Mahawatta','Ganemulla','uva',11020,'xxx','2452','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx',1500.00,'2024-06-02 13:14:49'),(76,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','hn ','234','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx','frfr','425/27/A,11 Lane Mahawatta','Ganemulla','sabaragamuwa',11020,'xxx',1500.00,'2024-06-02 13:17:44'),(77,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','gtgtg','rgrtvr','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx','45','425/27/A,11 Lane Mahawatta','Ganemulla','uva',11020,'xxx',500.00,'2024-06-02 13:19:09'),(78,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','gfvh','78089','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx','4645','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'xxx',0.00,'2024-06-02 13:39:35'),(79,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','gfvh','78089','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'xxx','4645','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'xxx',0.00,'2024-06-02 13:39:38'),(80,22,'Seynath','Thenura','COD','jseynaththenura@gmail.com',786068119,'Processing','good','','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx','45','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'xxx',500.00,'2024-06-03 04:54:20'),(81,22,'ttttttt','Thenura','Card','uuuuuuuuu@stu.kln.ac.lk',786068119,'Processing','ukh','876','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka','45','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka',2100.00,'2024-06-03 14:51:08'),(82,22,'Seynath','Thenura','Card','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','hbkbj,mn','767','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka','345','425/27/A,11 Lane Mahawatta','Ganemulla','uva',11020,'sri lanka',2100.00,'2024-06-03 15:05:25'),(83,22,'qqqqq','qwwww','Card','qwqwqwqwq@stu.kln.ac.lk',786068119,'Processing','old','232','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka','frfr','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'sri lanka',1500.00,'2024-06-08 17:29:01'),(84,22,'Seynath','Thenura','Card','jseynaththenura@gmail.com',786068119,'Processing','jijijiji','','425/27/A,11 Lane Mahawatta','Ganemulla','uva',11020,'sri lanka','4gt4etve','425/27/A,11 Lane Mahawatta','Ganemulla','western',11020,'sri lanka',1000.00,'2024-06-04 18:57:26'),(85,22,'Seynath','Thenura','Card','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','order should be hurry','wlrjf','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka','2452','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'sri lanka',500.00,'2024-06-04 19:42:34'),(86,22,'Ranul','Shenuka','Card','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','Hurry','34','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'sri lanka','2452','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka',9000.00,'2024-06-05 03:31:35'),(87,22,'Seynath','Thenura','Card','jseynaththenura@gmail.com',786068119,'Processing','hurry','3434','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka','343','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'sri lanka',4500.00,'2024-06-05 05:50:58'),(88,22,'bole','Thenura','Card','jseynaththenura@gmail.com',786068119,'shipped','hwwwwww','2334','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka','345','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'sri lanka',4500.00,'2024-06-05 06:02:24'),(89,22,'Seynath','Thenura','Card','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','','','425/27/A,11 Lane Mahawatta','Ganemulla','western',11020,'sri lanka','4gt4etve','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka',5100.00,'2024-06-05 09:50:47'),(90,22,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','','','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka','4gt4etve','425/27/A,11 Lane Mahawatta','Ganemulla','western',11020,'sri lanka',19500.00,'2024-06-05 11:40:07'),(91,22,'juuunhu','hyhy','Card','jseynaththenura@gmail.com',786068119,'Processing','9/6','','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','north-western',11020,'sri lanka',1500.00,'2024-06-09 09:48:59'),(92,40,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','jlonath order','','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka',2776.00,'2024-06-09 17:39:27'),(93,40,'Seynath','Thenura','Card','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','jlonath 2 order','','425/27/A,11 Lane Mahawatta','Ganemulla','sabaragamuwa',11020,'sri lanka','345','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka',3000.00,'2024-06-09 17:41:42'),(94,22,'Seynath','Thenura','Card','thenura-im20102@stu.kln.ac.lk',786068119,'Processing','i want this before next month','','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','southern',11020,'sri lanka',3000.00,'2024-06-12 03:18:49'),(95,22,'Seynath','Thenura','Card','jseynaththenura@gmail.com',786068119,'Processing','hi hi','','425/27/A/1, Mahawaththa','Ganemulla','northern',11020,'sri lanka','','425/27/A/1, Mahawaththa','Ganemulla','uva',11020,'sri lanka',1500.00,'2024-06-12 12:09:02'),(96,22,'Seynath','Thenura','COD','jseynaththenura@gmail.com',786068119,'Processing','18 56','','425/27/A/1, Mahawaththa','Ganemulla','central',11020,'sri lanka','','425/27/A/1, Mahawaththa','Ganemulla','nothern-western',11020,'sri lanka',4500.00,'2024-06-12 13:26:15'),(97,40,'Seynath','Thenura','COD','thenura-im20102@stu.kln.ac.lk',786068119,'delivered','gfd','','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','north-central',11020,'sri lanka',2500.00,'2024-06-12 13:38:42'),(98,43,'Last','Test','Card','seylosa1234@gmail.com',786068119,'shipped','last order','','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','sabaragamuwa',11020,'sri lanka',7500.00,'2024-06-13 14:36:05'),(99,43,'Seynath','Thenura','Card','jseynaththenura@gmail.com',786068119,'Processing','Test 123','','425/27/A,11 Lane Mahawatta','Ganemulla','central',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka',3000.00,'2024-06-14 02:35:24'),(100,40,'Seynath','Thenura','Card','jlonathkesara@gmail.com',786068119,'Processing','deliver within month','','425/27/A,11 Lane Mahawatta','Ganemulla','nothern-western',11020,'sri lanka','','425/27/A,11 Lane Mahawatta','Ganemulla','northern',11020,'sri lanka',3000.00,'2024-06-14 05:39:32');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `p_id` smallint NOT NULL AUTO_INCREMENT,
  `p_title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `sold` int DEFAULT '0',
  `total_rating` decimal(3,1) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_id`),
  KEY `fk_category_id` (`category_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (102,'Women Sleeve Pullover Tunic Tops ','Women-Sleeve-Pullover-Tunic-Tops','<p>Feature: 100% Brand new and high quality</p><p><strong>Style</strong>: fashion,casual</p><p><strong>Size</strong>: M,L,XL,2XL,3XL</p><p>Material: cotton blend</p><p>Sleeve length: 3/4 sleeve</p><p>Thickness: thin</p><p>Neckline: o-neck</p><p>Length: hips</p><p>Pattern: floral</p><p>Season: summer</p><p>Occasion: everyday, daily</p><p>Garment: hand washing or machine washing,line dry.</p><p>Package:1pcs tops</p>','LORA',NULL,1500.00,16,4.0,9,'2024-05-30 07:35:12'),(105,'POLO Jeans for women','POLO-Jeans-for-women','<p>Feature: 100% Brand new and high quality</p><p><strong>Style</strong>: fashion,casual</p><p><strong>Size</strong>: M,L,XL,2XL,3XL</p><p>Material: cotton blend</p><p>Sleeve length: 3/4 sleeve</p><p>Thickness: thin</p><p>Neckline: o-neck</p><p>Length: hips</p>','POLO',NULL,500.00,11,NULL,11,'2024-05-31 16:44:32'),(106,'Adidas Men\'s Fresh T-Shirt','Adidas-Men\'s-Fresh-T-Shirt','<p>Features:</p><p><br></p><p>* Regular Fit</p><p>* Ribbed Crewneck Collar</p><p>* Short Sleeves</p><p>* Adidas Badge of Sport on Center Chest</p><p>* Better Cotton Initiative [Sustainable Manufacturing in the Cotton Industry]</p><p>* Materials: [100% Recycled Cotton / Single Jersey]</p><p>* Men\'s Basic Branded Blank Adidas T-Shirt</p>','Adidas',NULL,4500.00,11,4.5,15,'2024-06-05 03:28:20'),(107,'Linen Denim For Women','Linen-Denim-For-Women','<p><span style=\"color: rgb(102, 102, 102);\">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</span></p>','Luise',NULL,888.00,0,NULL,12,'2024-06-06 07:15:11'),(108,'Adidas Mens Sport Tshirt','Adidas-Mens-Sport-Tshirt','<p><span style=\"color: rgb(102, 102, 102);\">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</span></p>','Luise',NULL,888.00,2,NULL,15,'2024-06-06 07:19:02'),(109,'Rever T-Shirt for Men','Rever-T-Shirt-for-Men','<p>ouuhkhvhxcgcvhmbnuh ig h hou hiuh</p>','Rever',NULL,900.00,0,NULL,15,'2024-06-06 07:20:09'),(110,'Seizeer Rise T Shirt','Seizeer-Rise-T-Shirt','<p>dgfvsvsdcvsdcvds</p>','dncmlkja',NULL,5000.00,0,NULL,16,'2024-06-13 14:25:35'),(111,'Last Product','Last-Product','<p>last thing and last try</p>','Last',NULL,4000.00,0,NULL,15,'2024-06-13 14:40:44'),(112,'Mens Nike T Shirt','Mens-Nike-T-Shirt','<p>Feature: 100% Brand new and high quality</p><p><strong>Style</strong>: fashion,casual</p><p><strong>Size</strong>: M,L,XL,2XL,3XL</p><p>Material: cotton blend</p><p>Sleeve length: 3/4 sleeve</p><p>Thickness: thin</p><p>Neckline: o-neck</p><p>Length: hips</p>','NIKE',NULL,1000.00,0,NULL,15,'2024-06-14 05:43:41');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `r_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` smallint NOT NULL,
  `star` decimal(3,1) NOT NULL,
  `comment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`r_id`),
  KEY `fkey_user_id` (`user_id`),
  KEY `fkey_product_id` (`product_id`),
  CONSTRAINT `fkey_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkey_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (4,22,102,4.0,'super','2024-05-31 12:10:04'),(5,22,106,5.0,'not bad','2024-06-05 03:32:38'),(6,17,106,4.0,'super','2024-06-06 09:18:46');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `sales_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`sales_id`),
  KEY `sales_user` (`user_id`),
  KEY `fk_sales_branch` (`branch_id`),
  CONSTRAINT `fk_sales_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  CONSTRAINT `sales_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (20,19,'2024-06-01 15:32:31',2),(21,19,'2024-06-01 15:35:28',2),(22,19,'2024-06-01 15:36:12',2),(23,19,'2024-06-01 15:38:36',2),(24,19,'2024-06-01 15:42:35',2),(25,19,'2024-06-01 15:43:04',2),(26,19,'2024-06-01 16:15:03',1),(27,19,'2024-06-01 16:22:12',1),(28,19,'2024-06-01 17:48:05',1),(29,19,'2024-06-04 18:20:02',1),(30,19,'2024-06-05 03:37:02',1),(31,19,'2024-06-05 06:00:07',1),(32,19,'2024-06-05 06:00:32',1),(33,19,'2024-06-12 06:13:30',1),(34,19,'2024-06-12 06:20:37',2),(35,19,'2024-06-13 12:00:15',1),(36,19,'2024-06-13 12:05:24',2),(37,19,'2024-06-13 12:10:04',2),(38,19,'2024-06-13 12:10:44',2),(39,19,'2024-06-13 14:42:39',2),(40,19,'2024-06-13 14:43:11',2);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_items`
--

DROP TABLE IF EXISTS `sales_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_items` (
  `sales_item_id` int NOT NULL AUTO_INCREMENT,
  `size_color_quantity_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` decimal(8,2) NOT NULL,
  `sales_id` int NOT NULL,
  PRIMARY KEY (`sales_item_id`),
  KEY `sales_items_sales` (`sales_id`),
  KEY `sales_items_size_color_quantity` (`size_color_quantity_id`),
  CONSTRAINT `sales_items_sales` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`sales_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sales_items_size_color_quantity` FOREIGN KEY (`size_color_quantity_id`) REFERENCES `size_color_quantity` (`size_color_quantity_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_items`
--

LOCK TABLES `sales_items` WRITE;
/*!40000 ALTER TABLE `sales_items` DISABLE KEYS */;
INSERT INTO `sales_items` VALUES (22,128,1,1500.00,20),(23,128,1,1500.00,21),(24,129,1,1500.00,23),(25,129,1,1500.00,24),(26,129,1,1500.00,25),(27,129,1,1500.00,26),(28,127,2,3000.00,26),(29,127,1,1500.00,27),(30,147,2,1400.00,28),(32,147,1,700.00,29),(33,123,2,3000.00,29),(34,151,2,9000.00,30),(35,148,2,1200.00,32),(36,129,1,1500.00,33),(37,153,2,1776.00,34),(38,154,3,2700.00,34),(39,152,2,1776.00,35),(40,153,1,888.00,35),(41,147,3,2100.00,36),(42,151,2,9000.00,36),(43,122,1,1500.00,37),(44,130,1,1500.00,38),(45,147,2,1400.00,40);
/*!40000 ALTER TABLE `sales_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size`
--

DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `size_id` smallint NOT NULL AUTO_INCREMENT,
  `size_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Free Size',
  PRIMARY KEY (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size`
--

LOCK TABLES `size` WRITE;
/*!40000 ALTER TABLE `size` DISABLE KEYS */;
INSERT INTO `size` VALUES (5,'S'),(6,'M'),(7,'L'),(8,'XL'),(9,'2XL'),(10,'3XL'),(12,'XS'),(13,'Free Size');
/*!40000 ALTER TABLE `size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size_color_quantity`
--

DROP TABLE IF EXISTS `size_color_quantity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size_color_quantity` (
  `size_color_quantity_id` int NOT NULL AUTO_INCREMENT,
  `product_id` smallint NOT NULL,
  `size_id` smallint NOT NULL,
  `color_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(8,2) NOT NULL,
  `buying_price` decimal(8,2) DEFAULT '0.00',
  `barcode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`size_color_quantity_id`),
  KEY `fk_size_color_quantity_product_id_id` (`product_id`),
  KEY `fk_size_color_quantity_color_id` (`color_code`),
  KEY `fk_size_color_quantity_size_id` (`size_id`),
  CONSTRAINT `fk_size_color_quantity_color_id` FOREIGN KEY (`color_code`) REFERENCES `color` (`col_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_size_color_quantity_product_id_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_size_color_quantity_size_id` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size_color_quantity`
--

LOCK TABLES `size_color_quantity` WRITE;
/*!40000 ALTER TABLE `size_color_quantity` DISABLE KEYS */;
INSERT INTO `size_color_quantity` VALUES (122,102,5,'#00ff40',2,1500.00,990.00,'10205'),(123,102,5,'#a600ff',2,1500.00,990.00,'10215'),(124,102,5,'#3700ff',4,1500.00,990.00,'10225'),(125,102,6,'#00ff40',1,1500.00,990.00,'10236'),(126,102,6,'#a600ff',3,1500.00,990.00,'10246'),(127,102,6,'#3700ff',4,1500.00,990.00,'10256'),(128,102,7,'#00ff40',4,1500.00,990.00,'10267'),(129,102,7,'#a600ff',7,1500.00,990.00,'10277'),(130,102,7,'#3700ff',4,1500.00,990.00,'10287'),(146,105,5,'#000000',0,500.00,200.00,'10505'),(147,105,6,'#000000',3,700.00,300.00,'10516'),(148,105,6,'#00ff40',6,600.00,300.00,'10526'),(149,106,5,'#640202',1,4500.00,2500.00,'10605'),(150,106,5,'#7d7d7d',0,4500.00,2500.00,'10615'),(151,106,5,'#ff0000',3,4500.00,2500.00,'10625'),(152,107,6,'#3700ff',5,888.00,602.00,'10706'),(153,108,6,'#3700ff',7,888.00,600.00,'10806'),(154,109,7,'#00ff40',4,900.00,400.00,'10907'),(155,110,7,'#7d7d7d',20,5000.00,2000.00,'11007'),(156,110,6,'#3700ff',30,5000.00,2000.00,'11016'),(157,111,8,'#ff0000',2,4000.00,1500.00,'11108'),(158,111,9,'#ff0000',3,4000.00,2000.00,'11119'),(159,109,6,'#3700ff',6,1500.00,396.00,'10916'),(160,112,5,'#000000',5,1000.00,500.00,'11205'),(161,112,5,'#00ff40',6,1000.00,500.00,'11215'),(162,112,6,'#000000',5,1500.00,600.00,'11226');
/*!40000 ALTER TABLE `size_color_quantity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_phone` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_address` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (10,'JK','jk@jk.jk','0712234489','colombo'),(12,'oolu1','oolu@gmail.com','6876187687','sjhbckjdnc');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_products`
--

DROP TABLE IF EXISTS `supplier_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_products` (
  `supplier_products_id` int NOT NULL AUTO_INCREMENT,
  `product_id` smallint NOT NULL,
  `supplier_id` int NOT NULL,
  PRIMARY KEY (`supplier_products_id`),
  KEY `supplier_product` (`product_id`),
  KEY `supplier_product_to_supplier` (`supplier_id`),
  CONSTRAINT `supplier_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `supplier_product_to_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_products`
--

LOCK TABLES `supplier_products` WRITE;
/*!40000 ALTER TABLE `supplier_products` DISABLE KEYS */;
INSERT INTO `supplier_products` VALUES (49,105,10),(50,106,10),(54,107,12),(55,109,12);
/*!40000 ALTER TABLE `supplier_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` int DEFAULT NULL,
  `password` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT '0',
  `passwordResetToken` text COLLATE utf8mb4_unicode_ci,
  `passwordResetExpires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'admins','sena','admin@gmail.com',2147483647,'$2b$10$t1XKKQjaUJ2Vc0VsQNf/juazMP4iPHdnKUJEAhGy2XLqHpCsotJKa','admin',0,NULL,NULL),(13,'user','sena','user@gmail.com',2147483647,'$2b$10$xnbyeVy4DYOy2IFvvDUywONXTC5453JtqZwF92aePq1qmEzc3p8yW','user',0,NULL,NULL),(14,'re','re','user1@gmail.com',77777788,'$2b$10$/Dvm8AD2RFnRulS6hrHyD.jX3lfh1uNdwKBDT.C0a0C98ydt8au5C','cashier',0,NULL,NULL),(15,'user','sena','user3@gmail.com',2147483647,'$2b$10$I29aRl452z7Km6tfm1XXzuxDpPROoozowxW6FT9SAZMiXo7VQPw86','admin',0,NULL,NULL),(16,'Ralfa','Sirena','craftsailife@gmail.com',786068119,'$2b$10$KxTbKnvW67hCg7vu3d4NnOqldNM2qkORL/L9MsOxIef75wD.4K8Gm','cashier',0,NULL,NULL),(17,'sena','Thenura','aa@aa.aa',1111111111,'$2b$10$haCyKvbzzfoPLS6tyMqhjOXTJXjE6u9ZFFteKoOYtbWXGG8PBhFRK','user',0,NULL,NULL),(18,'testf','testl','testtest@test.com',1234567890,'$2b$10$PRJQXtZkC8ND4i2SRMLtTODmfurp6eiuoDQguYXCVRzzxkXYAVN.2','user',0,NULL,NULL),(19,'rosa','dea','cashier1@gmail.com',757598621,'$2b$10$D7YiDtMToJPpTlVt7WIs4OO9vTgcDOuDu2aHb48lWWq1Y39saVxaK','cashier',0,NULL,NULL),(20,'check','cart','checkcart@gmail.com',1234567890,'$2b$10$y10qy/RWh1vXsINlcm31q.VjzODCEcXZ25pebvKoq.d2Z59YlvB6C','user',0,NULL,NULL),(21,'cart','check','checkcart1@gmail.com',1234567890,'$2b$10$DnQrgX2IJ.UqLE8qydjoD.mllQjwQG9LTayFORihTaaffqkvxSCLi','user',0,NULL,NULL),(22,'Seynath','Thenura','jseynaththenura@gmail.com',1234567890,'$2b$10$afMc1qxOSZWTWnjYDRFMH.yWYIH9nXTJ1jQMc755mkNBUfzEnqiii','admin',0,NULL,NULL),(23,'Nisitha','Perera','nisitha@gmail.com',751234567,'$2b$10$MzqcEUYHO/5JTY2kqlBEmu.8YlCCY14Z5D6TbjcqLBwk6MIwEHBVO','user',0,NULL,NULL),(24,'Ranil','Shirantha','dilupa.theekshana@gmail.com',789456123,'$2b$10$sM3VaTuYBIRijj0et6Wv8OpfhgBGUgDAOMk8H.37mWTTqhNAh2VrC','user',0,NULL,NULL),(25,'testuser1','testuser','testuser1@gmail.com',1234567898,'$2b$10$SSXg0yA/pZli2IKlS7bjkOwRDQKyUrZdvkZ1KDT3si6PJGlEaIVoS','user',0,NULL,NULL),(26,'wewdwd','dwdwdw','testuser2@gmail.com',1234545454,'$2b$10$ufH4BbamWZfh0SKLjb48xehXCH8auz0llEqC0pFnM6T1WmEuiLuO2','user',0,NULL,NULL),(27,'wewdwd','dwdwdw','testuser3@gmail.com',1234545454,'$2b$10$nIfcFGAbCyFtLm.3SurZtOMI7oeEqdKfDtAVKEvrwmTid5CwdVKqG','user',0,NULL,NULL),(28,'dscsdcs','sjncskdnc','mysql2user1@gmail.com',1234567890,'$2b$10$njfuQN.nZOrO665lPZmice55tdRj9InfN/M7YC8vXhCCuCcQlhd8u','user',0,NULL,NULL),(29,'dscsdcs','sjncskdnc','mysql2user2@gmail.com',1234567890,'$2b$10$hsa9Yopftq0Hz4m7OurwEeWybz40b0TOPSZCmV4FJZKuzOpXnU6zC','user',0,NULL,NULL),(40,'senath','theeenura','jlonathkesara@gmail.com',1234567890,'$2b$10$vQlBbSqE.ikkBpWSk708duquAjG2iSjpQ04OXqbIgQi5puooVX.Gu','user',0,NULL,NULL),(41,'Seynath','Thenura','fghjk@gmail.com',786068119,'$2b$10$X0QdKzKZeaNnq1Z.Wu7WwehmrLI1BjprTitw6xwFeD5JpJ/QNlSjG','user',0,NULL,NULL),(42,'uorijwirjfw','sfnjklnd','bjhfbsfc@dfbv.skh',1234567890,'$2b$10$nvtXNWPpLT7YseooR9dloOiSNRPItfrZW.LGH7kW0NceM9BrEd/gO','user',0,NULL,NULL),(43,'last ','Thenura','jlonatfvbnm@gmail.com',786068119,'$2b$10$d3h2TDzfsguduVti9SK/vOtcQ81wxt4.JjxQhcUVeMI3MGVFbga7y','user',0,NULL,NULL),(44,'sena','thenura','djkahcbc@gmail.com',1234567890,'$2b$10$wY.mIDH.o0hCoR3T.Fkp5.ZR7Z1NM/Y1Mhxlibb0/S2DNGOduxtZS','user',0,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `w_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` smallint NOT NULL,
  PRIMARY KEY (`w_id`),
  KEY `fk_product_id` (`product_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (114,17,108),(119,22,102),(120,40,105),(121,40,102);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-12 12:00:43

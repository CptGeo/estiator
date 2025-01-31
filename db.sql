-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: estiator
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `persons` int DEFAULT NULL,
  `status` smallint DEFAULT NULL,
  `time` time(6) DEFAULT NULL,
  `created_by_user_id` bigint DEFAULT NULL,
  `created_for_user_id` bigint DEFAULT NULL,
  `table_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjnhj9kb99h37wt8avmcfr0m3g` (`created_by_user_id`),
  KEY `FKqvl1u3yxv6n2e42ndn1gidn6w` (`created_for_user_id`),
  KEY `FKritru50ljg3q6ytxriivjlmq6` (`table_id`),
  CONSTRAINT `FKjnhj9kb99h37wt8avmcfr0m3g` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqvl1u3yxv6n2e42ndn1gidn6w` FOREIGN KEY (`created_for_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKritru50ljg3q6ytxriivjlmq6` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (11,'2025-01-30 17:10:05.267559','2025-01-30',100,1,'15:00:00.000000',1,1,23),(23,'2025-01-30 17:08:54.653655','2025-01-27',4,3,'11:00:00.000000',1,14,23),(24,'2025-01-30 17:05:55.693545','2025-01-30',10,2,'09:00:00.000000',11,14,22),(28,'2025-01-30 17:06:43.505672','2025-01-30',1,2,'20:30:00.000000',1,35,26),(29,'2025-01-30 17:47:36.764973','2025-01-30',1,3,'19:30:00.000000',1,35,22),(30,'2025-01-30 17:10:29.250758','2025-01-30',1,2,'18:00:00.000000',1,36,27);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `end_time` time(6) DEFAULT NULL,
  `start_time` time(6) DEFAULT NULL,
  `status` smallint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UniqueUserAndDate` (`user_id`,`date`),
  CONSTRAINT `FKd4y4xekwahv9boo6lc8gfl3jv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'2025-01-23','17:00:00.000000','10:00:00.000000',0,1),(16,'2025-01-01','17:00:00.000000','10:00:00.000000',0,1),(17,'2025-01-02','17:00:00.000000','10:00:00.000000',0,1),(18,'2025-01-03','17:00:00.000000','10:00:00.000000',0,1),(19,'2025-01-04','17:00:00.000000','10:00:00.000000',0,1),(20,'2025-01-05','17:00:00.000000','10:00:00.000000',0,1),(21,'2025-01-06','17:00:00.000000','10:00:00.000000',0,1),(22,'2025-01-07','17:00:00.000000','10:00:00.000000',0,1),(23,'2025-01-08','17:00:00.000000','10:00:00.000000',0,1),(24,'2025-01-09','17:00:00.000000','10:00:00.000000',0,1),(25,'2025-01-10','17:00:00.000000','10:00:00.000000',0,1),(26,'2025-01-11','17:00:00.000000','10:00:00.000000',0,1),(27,'2025-01-12','17:00:00.000000','10:00:00.000000',0,1),(28,'2025-01-13','17:00:00.000000','10:00:00.000000',0,1),(29,'2025-01-14','17:00:00.000000','10:00:00.000000',0,1),(30,'2025-01-15','17:00:00.000000','10:00:00.000000',0,1),(31,'2025-01-16','17:00:00.000000','10:00:00.000000',0,1),(32,'2025-01-17','17:00:00.000000','10:00:00.000000',0,1),(33,'2025-01-18','17:00:00.000000','10:00:00.000000',0,1),(34,'2025-01-19','17:00:00.000000','10:00:00.000000',0,1),(35,'2025-01-20','17:00:00.000000','10:00:00.000000',0,1),(36,'2025-01-21','17:00:00.000000','10:00:00.000000',0,1),(37,'2025-01-22','17:00:00.000000','10:00:00.000000',0,1),(38,'2025-01-24','17:00:00.000000','10:00:00.000000',0,1),(39,'2025-01-25','17:00:00.000000','10:00:00.000000',0,1),(40,'2025-01-26','17:00:00.000000','10:00:00.000000',0,1),(41,'2025-01-27','17:00:00.000000','10:00:00.000000',0,1),(42,'2025-01-28','17:00:00.000000','10:00:00.000000',0,1),(43,'2025-01-29','17:00:00.000000','10:00:00.000000',0,1),(44,'2025-01-30','17:00:00.000000','10:00:00.000000',0,1),(45,'2025-01-31','17:00:00.000000','10:00:00.000000',0,1);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacity` int DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `x` int DEFAULT NULL,
  `y` int DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa46mvfaviexapys9mope0pwyj` (`user_id`),
  CONSTRAINT `FKa46mvfaviexapys9mope0pwyj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (3,2,'bg-sky-500','A1',280,360,NULL),(22,2,'bg-primary','Z2',720,260,NULL),(23,2,'bg-danger','G1',60,360,NULL),(24,2,'bg-success','E1',500,360,NULL),(25,2,'bg-success','E2',500,260,NULL),(26,2,'bg-sky-500','A2',280,260,NULL),(27,2,'bg-danger','G2',60,260,NULL),(28,2,'bg-primary','Z1',720,360,NULL);
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` smallint DEFAULT NULL,
  `surname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_role` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-01-28 22:25:52.208192','george.kalyvianakis@gmail.com','George','$2a$10$evZ7mfbux9.tKHWtSAoAx.rOTiZ583XcQhVjuTwG/W9wjzz9HTiC.','+30 6985555556','Head Waiter','',0,'Kalyvianakis','ROLE_ADMIN'),(11,'2025-01-30 17:04:42.545688','madalena@gmail.com','Lefteris','$2a$10$evZ7mfbux9.tKHWtSAoAx.rOTiZ583XcQhVjuTwG/W9wjzz9HTiC.',NULL,'Customer Support Specialist',NULL,0,'Agathongonas','ROLE_MODERATOR'),(14,'2025-01-30 17:19:29.123762','guest3@gmail.com','Jack','$2a$10$x7/nz4QUrulvJdFs99Qh/ubWLP0LE6SxKGVhm399IORIDD/rCYRyq','+420 604903771',NULL,NULL,0,'Manolis','ROLE_GUEST'),(35,'2025-01-30 17:19:18.198090','guest2@gmail.com','Lakis','$2a$10$MjoIznozyzJo4nTNz2nZD.8/nSWeurfovzU8SSHmdDRV244l.U1gu','+30 6973839662',NULL,NULL,0,'Glykoulis','ROLE_GUEST'),(36,'2025-01-30 17:11:06.160678','guest@gmail.com','Manousos',NULL,'+30 504495833',NULL,NULL,0,'Chochlidakis','ROLE_GUEST');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'estiator'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-31  9:12:41

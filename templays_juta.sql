-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql
-- Tiempo de generación: 26-11-2025 a las 11:21:48
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `templays_juta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tajustes`
--

CREATE TABLE `tajustes` (
  `id` int NOT NULL,
  `idArticulo` int NOT NULL,
  `tipo` enum('ingreso','egreso') COLLATE utf8mb4_spanish_ci NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `motivo` text COLLATE utf8mb4_spanish_ci,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `esnuevo` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tajustes`
--

INSERT INTO `tajustes` (`id`, `idArticulo`, `tipo`, `cantidad`, `motivo`, `email`, `fecha_hora`, `esnuevo`) VALUES
(15, 13, 'ingreso', 5.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:54:37', 1),
(16, 14, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:55:00', 1),
(17, 15, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:55:22', 1),
(18, 16, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:55:48', 1),
(19, 17, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:56:27', 1),
(20, 19, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:57:07', 1),
(21, 20, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:57:31', 1),
(22, 21, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:57:52', 1),
(23, 22, 'ingreso', 4.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 09:58:21', 1),
(24, 11, 'ingreso', 9.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:08:14', 1),
(25, 12, 'ingreso', 9.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:08:46', 1),
(26, 23, 'ingreso', 6.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:09:21', 1),
(27, 24, 'ingreso', 4.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:09:40', 1),
(28, 26, 'ingreso', 13.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:12:44', 1),
(29, 27, 'ingreso', 14.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:13:01', 1),
(30, 28, 'ingreso', 68.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:13:22', 1),
(31, 29, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:13:58', 1),
(32, 30, 'ingreso', 6.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:14:32', 1),
(33, 31, 'ingreso', 26.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:14:58', 1),
(34, 32, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:15:19', 1),
(35, 33, 'ingreso', 4.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:15:38', 1),
(36, 34, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:16:07', 0),
(37, 35, 'ingreso', 10.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:16:37', 1),
(38, 36, 'ingreso', 4.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:16:54', 1),
(39, 37, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:17:19', 1),
(40, 66, 'ingreso', 7.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:19:23', 1),
(41, 38, 'ingreso', 12.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:19:40', 1),
(42, 39, 'ingreso', 9.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:19:59', 1),
(43, 40, 'ingreso', 7.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:20:16', 1),
(44, 41, 'ingreso', 9.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:20:42', 1),
(45, 42, 'ingreso', 10.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-06 11:21:04', 1),
(46, 64, 'egreso', 2.00, 'unidad 91', 'mgdanielali2020@gmail.com', '2025-11-06 11:40:59', 1),
(47, 101, 'ingreso', 2.00, 'compra', 'mgdanielali2020@gmail.com', '2025-11-11 09:26:32', 1),
(48, 101, 'egreso', 1.00, 'reposicion 91', 'mgdanielali2020@gmail.com', '2025-11-11 09:27:21', 1),
(49, 102, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-11 09:31:02', 1),
(50, 102, 'egreso', 1.00, 'unidad 39', 'mgdanielali2020@gmail.com', '2025-11-11 09:31:34', 1),
(53, 11, 'egreso', 1.00, 'unidad 13', 'mgdanielali2020@gmail.com', '2025-11-20 10:19:15', 1),
(54, 33, 'egreso', 1.00, 'unidad 39', 'mgdanielali2020@gmail.com', '2025-11-20 10:25:07', 1),
(55, 121, 'ingreso', 2.00, 'compra', 'mgdanielali2020@gmail.com', '2025-11-20 10:32:32', 1),
(56, 43, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:41:22', 1),
(57, 44, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:41:37', 1),
(58, 45, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:42:07', 1),
(59, 46, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:42:45', 1),
(60, 47, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:43:09', 1),
(61, 48, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:43:25', 1),
(62, 49, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:44:24', 1),
(63, 50, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:44:59', 1),
(64, 51, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:45:22', 1),
(65, 52, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:46:02', 1),
(66, 53, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:46:46', 1),
(67, 54, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:47:17', 1),
(68, 55, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:47:46', 1),
(69, 56, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:48:19', 1),
(70, 57, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 10:48:49', 1),
(71, 58, 'ingreso', 10.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:04:03', 1),
(72, 59, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:04:23', 1),
(73, 60, 'ingreso', 5.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:08:41', 1),
(74, 61, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:09:27', 1),
(75, 62, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:09:57', 1),
(76, 63, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:10:16', 1),
(77, 64, 'ingreso', 5.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:11:28', 1),
(78, 65, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:13:12', 1),
(79, 14, 'egreso', 1.00, 'unidad 39', 'mgdanielali2020@gmail.com', '2025-11-20 11:18:36', 1),
(80, 21, 'egreso', 1.00, 'unidad 23', 'mgdanielali2020@gmail.com', '2025-11-20 11:20:25', 1),
(81, 15, 'egreso', 1.00, 'unidad 39', 'mgdanielali2020@gmail.com', '2025-11-20 11:20:44', 1),
(82, 14, 'egreso', 1.00, 'ajuste', 'mgdanielali2020@gmail.com', '2025-11-20 11:22:54', 1),
(83, 20, 'egreso', 1.00, 'ajuste', 'mgdanielali2020@gmail.com', '2025-11-20 11:24:49', 1),
(84, 21, 'egreso', 1.00, 'ajuste', 'mgdanielali2020@gmail.com', '2025-11-20 11:25:04', 1),
(85, 115, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:27:29', 0),
(86, 116, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:27:59', 0),
(87, 114, 'ingreso', 1.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:28:36', 0),
(88, 117, 'ingreso', 10.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:29:31', 1),
(89, 118, 'ingreso', 2.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:29:57', 1),
(90, 119, 'ingreso', 3.00, 'inicio de stock', 'mgdanielali2020@gmail.com', '2025-11-20 11:30:40', 1),
(91, 122, 'ingreso', 2.00, 'compra', 'mgdanielali2020@gmail.com', '2025-11-20 11:44:30', 1),
(92, 123, 'ingreso', 1.00, 'compra', 'mgdanielali2020@gmail.com', '2025-11-20 12:06:23', 1),
(93, 124, 'ingreso', 1.00, 'compra', 'mgdanielali2020@gmail.com', '2025-11-20 12:07:30', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarticulos`
--

CREATE TABLE `tarticulos` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci,
  `idCategoria` int DEFAULT NULL,
  `stock_minimo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `activo` tinyint(1) DEFAULT '1',
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tarticulos`
--

INSERT INTO `tarticulos` (`id`, `nombre`, `descripcion`, `idCategoria`, `stock_minimo`, `activo`, `creado_en`, `actualizado_en`) VALUES
(11, 'H7 12v - 55w', 'Px26D - 64210  OSRAM 12V\n', 18, 2.00, 1, '2025-11-03 20:16:06', '2025-11-06 10:00:20'),
(12, 'P21/5W - N380', 'BAY 15D	Neolux 12V\n', 18, 4.00, 1, '2025-11-03 20:17:20', '2025-11-03 20:17:20'),
(13, 'Elemento de filtro de aire', 'Codigo de fabrica MB A6955280006\n', 15, 2.00, 1, '2025-11-06 09:45:23', '2025-11-06 09:45:23'),
(14, 'Filtro de combustible', 'Codigo catalogo MB A6510902952\n', 15, 2.00, 1, '2025-11-06 09:46:09', '2025-11-06 09:46:09'),
(15, 'Filtro de aceite APO', 'Codigo catalogo MB A0004295695\n', 15, 2.00, 1, '2025-11-06 09:46:59', '2025-11-06 09:46:59'),
(16, 'Filtro de polvo fino', 'Codigo catalogo MB A0008354800\n\n', 15, 2.00, 1, '2025-11-06 09:47:48', '2025-11-06 09:47:48'),
(17, 'Cartucho de filtro', 'Codigo catalogo MB A0008354800\n\n', 15, 2.00, 1, '2025-11-06 09:48:13', '2025-11-06 09:48:13'),
(19, 'Filtro de combustible WF', 'Codigo catalogo WF 10288  WIX (trampa de agua)\n\n', 15, 2.00, 1, '2025-11-06 09:49:57', '2025-11-06 09:49:57'),
(20, 'Kit filtros MB Sprinter (4115)', 'Codigo catalogo MB A654104115\n\n', 15, 2.00, 1, '2025-11-06 09:50:30', '2025-11-06 09:50:30'),
(21, 'Kit filtros MB Sprinter (6409)', 'Codigo catalogo MB A0001806409\n\n', 15, 2.00, 1, '2025-11-06 09:51:01', '2025-11-06 09:51:01'),
(22, 'Filtro de habitaculo', 'Codigo catalogo MB A9008350600 (515/415/411)\n\n\n', 15, 2.00, 1, '2025-11-06 09:52:06', '2025-11-06 09:52:06'),
(23, 'PY 21W - N382', 'BA 15 S	Neolux 12V\n', 18, 4.00, 1, '2025-11-06 10:02:50', '2025-11-06 10:02:50'),
(24, 'PY 21W - N581  (ambar)', 'BAU 15 S	Neolux	12V\n', 18, 4.00, 1, '2025-11-06 10:03:21', '2025-11-06 10:03:21'),
(25, 'R5W - N207', 'BA 15 S	Neolux	12V\n', 18, 4.00, 1, '2025-11-06 10:03:45', '2025-11-06 10:03:45'),
(26, 'R5W -12v - 5w', 'BA155	Osram	12 V\n', 18, 4.00, 1, '2025-11-06 10:04:12', '2025-11-06 10:04:12'),
(27, 'W5W -  N501', 'W2,1 x 9,5 d	Neolux	12V\n', 18, 4.00, 1, '2025-11-06 10:04:36', '2025-11-06 10:04:36'),
(28, 'Bulbos de 5 led', 'BULBOS DE CINCO LED 25V', 18, 5.00, 1, '2025-11-06 10:05:25', '2025-11-06 10:05:25'),
(29, 'H1 24v 70w  OSR', 'P14,5s	Osram	24V\n', 18, 4.00, 1, '2025-11-06 10:05:53', '2025-11-06 10:05:53'),
(30, 'H1 24v 70w BOS', 'P 14,5 S 466	Bosch	24V\n', 18, 5.00, 1, '2025-11-06 10:06:19', '2025-11-06 10:06:19'),
(31, 'H4 - 24v 75/70w EXELITE', 'P43T	Exelite	24V\n', 18, 4.00, 1, '2025-11-06 10:07:22', '2025-11-06 10:07:22'),
(32, 'H4 - 24v 75/70w NEOLUX', 'P43T	Neolux	24V\n', 18, 4.00, 1, '2025-11-06 10:07:51', '2025-11-06 10:07:51'),
(33, 'H4 - 24v 75/70w OSRAM', 'P43T	Osram	24 V\n', 18, 4.00, 1, '2025-11-06 10:08:25', '2025-11-06 10:08:25'),
(34, 'H4 75/70 OSRAM usado', 'Osram	24V	75 - 70 	En empaque de led\n', 18, 0.00, 1, '2025-11-06 10:09:39', '2025-11-20 10:29:11'),
(35, 'H7 - N499 A NEOLUX', 'PX 26 D	Neolux	24V	70W\n', 18, 4.00, 1, '2025-11-06 10:10:57', '2025-11-06 10:11:33'),
(36, 'H7 24v 70w EXELITE', 'PX 26 D	Exelite	24V	70W\n', 18, 4.00, 1, '2025-11-06 10:13:14', '2025-11-06 10:13:14'),
(37, 'H7 24v 70w OSRAM', 'PX 26 D	Osram	24V	70W\n', 18, 4.00, 1, '2025-11-06 10:13:50', '2025-11-06 10:13:50'),
(38, 'P 21 W - N241', 'BA 15 S	Neolux	24V	21W\n', 18, 4.00, 1, '2025-11-06 10:15:44', '2025-11-06 10:15:44'),
(39, 'P21/5W - N334', 'BAY 15D	Neolux	24V	21W - 5W\n', 18, 4.00, 1, '2025-11-06 10:16:15', '2025-11-06 10:16:15'),
(40, 'PY 21 W  (ambar)', 'BAU 15 S	Osram	24V	21W\n', 18, 4.00, 1, '2025-11-06 10:16:40', '2025-11-06 10:16:40'),
(41, 'R5W - N149', 'BA 15 S	Neolux	24V	5W\n', 18, 4.00, 1, '2025-11-06 10:17:08', '2025-11-06 10:17:08'),
(42, 'W5W -  N507', 'W2,1 x 9,5 d	Neolux	24V	5W\n\n\n', 18, 4.00, 1, '2025-11-06 10:17:47', '2025-11-06 10:17:47'),
(43, 'Fusible 200A', 'Fusible 200A  GEN ROD\n', 10, 1.00, 1, '2025-11-06 10:18:17', '2025-11-06 10:18:17'),
(44, 'Fusible 300A', 'Fusible 300A  GEN ROD\n', 10, 1.00, 1, '2025-11-06 10:18:41', '2025-11-06 10:18:41'),
(45, 'Tecla Baliza', 'Tecla Baliza SIN MARCA\n', 10, 1.00, 1, '2025-11-06 10:19:09', '2025-11-06 10:19:09'),
(46, 'Destellador 24v 170w D9047 Ralux', 'D9047	Ralux\n', 10, 1.00, 1, '2025-11-06 10:19:32', '2025-11-06 10:19:32'),
(47, 'Tecla 1 punto', '4102	FLOOD\n', 10, 1.00, 1, '2025-11-06 10:19:57', '2025-11-06 10:19:57'),
(48, 'Tecla 2 puntos', '5194	FLOOD\n', 10, 1.00, 1, '2025-11-06 10:20:16', '2025-11-06 10:20:16'),
(49, 'Destellador 24v DNI', '', 10, 1.00, 1, '2025-11-06 10:20:42', '2025-11-06 10:20:42'),
(50, 'Destellador 24v 170w D8236 Ralux', 'D8236	Ralux\n', 10, 1.00, 1, '2025-11-06 10:21:04', '2025-11-06 10:21:04'),
(51, 'Destellador 24v180w IM1134 Marilia', 'IM1134	Marilia\n', 10, 1.00, 1, '2025-11-06 10:21:30', '2025-11-06 10:21:30'),
(52, 'Minirele 24v 40a 5 terminales', 'KW0226	DNI\n', 10, 1.00, 1, '2025-11-06 10:21:53', '2025-11-06 10:21:53'),
(53, 'Destellador 24v 0831/41 DNI', '0831/41	DNI\n', 10, 1.00, 1, '2025-11-06 10:22:10', '2025-11-06 10:22:10'),
(54, 'Ramal con terminal ficha 16 pines', '', 10, 0.00, 1, '2025-11-06 10:22:28', '2025-11-06 10:22:28'),
(55, 'Palanca control luces omnibus', 'ZD273590ao	Gerastet\n', 10, 0.00, 1, '2025-11-06 10:22:49', '2025-11-06 10:22:49'),
(56, 'Tecla de control de volante', 'Sprinter\n', 10, 0.00, 1, '2025-11-06 10:23:12', '2025-11-06 10:23:12'),
(57, 'Pulsador dos contactos', 'MB', 10, 0.00, 1, '2025-11-06 10:23:28', '2025-11-06 10:23:28'),
(58, 'Sensores de stop', 'MB', 10, 2.00, 1, '2025-11-06 10:24:10', '2025-11-06 10:24:10'),
(59, 'Bulbo punto muerto', 'CODIGO CATALOGO MB A0025450209	Kissling\n', 10, 0.00, 1, '2025-11-06 10:24:51', '2025-11-06 10:24:51'),
(60, 'Relay 24 v 30 a Nosso', 'NY3345	Nosso\n', 10, 0.00, 1, '2025-11-06 10:25:11', '2025-11-06 10:25:11'),
(61, 'Sensor de temperatura', ' CODIGO CATALOGO A004153422864	MB\n', 10, 0.00, 1, '2025-11-06 10:25:38', '2025-11-06 10:25:38'),
(62, 'Zocalo de conexiÃ³n de 5 pines', '', 10, 0.00, 1, '2025-11-06 10:25:57', '2025-11-06 10:25:57'),
(63, 'Bocina 24 v  Ralux', 'IB0016	Ralux			105db\n', 10, 0.00, 1, '2025-11-06 10:26:16', '2025-11-06 10:26:16'),
(64, 'Tira de cinco led 24v PRR', 'Rohos	24\n', 18, 2.00, 1, '2025-11-06 10:26:49', '2025-11-06 10:26:49'),
(65, 'H1 24v 70w NEOLUX', 'P 14,5 S N466	Neolux	24V\n', 18, 2.00, 1, '2025-11-06 10:28:55', '2025-11-06 10:28:55'),
(66, 'H7 24v 70w POLI', 'P001170172	Poli	24V	70W\n', 18, 4.00, 1, '2025-11-06 11:18:42', '2025-11-06 11:18:42'),
(67, 'Aceite Rimula 10W40', 'Rimula  10w 40\n', 14, 30.00, 1, '2025-11-06 12:47:01', '2025-11-12 12:14:14'),
(68, 'Aceite Rimula 15W40', 'Rimula  15w 40\n', 14, 20.00, 1, '2025-11-07 09:32:42', '2025-11-07 09:32:42'),
(69, 'Aceite Spirax 56', 'AXME 75W 90\n', 14, 5.00, 1, '2025-11-07 09:33:12', '2025-11-07 09:33:12'),
(70, 'Aceite Spirax 52', 'A85W 140\n', 14, 5.00, 1, '2025-11-07 09:33:31', '2025-11-07 09:33:31'),
(71, 'Agua destilada', 'Agua destilada a granel\n', 14, 40.00, 1, '2025-11-07 09:34:05', '2025-11-07 09:34:05'),
(72, 'Aceite hidraulico', 'ATF D2	Tutela petronas\n', 14, 5.00, 1, '2025-11-07 09:34:40', '2025-11-07 09:34:40'),
(73, 'Urea ypf Azul 32', 'Urea ypf Azul 32 a granel\n', 14, 40.00, 1, '2025-11-07 09:35:12', '2025-11-07 09:35:12'),
(74, 'Paraflu', 'Paraflu Red	Petronas\n', 14, 20.00, 1, '2025-11-07 09:35:35', '2025-11-07 09:35:35'),
(75, 'Liquido frenos T3', 'Liquido frenos T3	Wagner Lokheed\n', 14, 1.00, 1, '2025-11-07 09:35:54', '2025-11-07 09:35:54'),
(76, 'Shampoo', 'Shampoo para lavado de unidades\n', 19, 1.00, 1, '2025-11-07 09:41:09', '2025-11-07 09:41:09'),
(77, 'Brillagoma', 'Brillagoma para unidades del lavadero\n', 19, 1.00, 1, '2025-11-07 09:41:38', '2025-11-07 09:41:38'),
(78, 'Cloro', 'Cloro para unidades\n', 19, 1.00, 1, '2025-11-07 09:41:56', '2025-11-07 09:41:56'),
(79, 'Quimico', 'Quimico para baÃ±o de unidades\n', 19, 1.00, 1, '2025-11-07 09:42:16', '2025-11-07 09:42:16'),
(80, 'Desodorante Piso', 'Desodorante de piso para unidades\n', 19, 1.00, 1, '2025-11-07 09:42:43', '2025-11-07 09:42:43'),
(81, 'JabonLiquido', 'Jabon liquido para manos en unidades\n', 19, 1.00, 1, '2025-11-07 09:43:03', '2025-11-07 09:43:03'),
(82, 'Bolsa basurin', 'Bolsa para basurin de unidad\n', 19, 10.00, 1, '2025-11-07 09:43:33', '2025-11-07 09:43:33'),
(83, 'Bolsa camiseta', 'Bolsa camiseta para residuos (por paquete)\n', 19, 2.00, 1, '2025-11-07 09:44:15', '2025-11-07 09:44:15'),
(84, 'Papel higienico', 'Papel higienico para unidades LD\n', 19, 2.00, 1, '2025-11-07 09:44:41', '2025-11-07 09:44:41'),
(85, 'Detergente', 'Detergente para lavado\n', 19, 1.00, 1, '2025-11-07 09:45:12', '2025-11-07 09:45:12'),
(86, 'Tubo led 18 W 220v', 'Tubo led 18 W 220v\n', 10, 0.00, 1, '2025-11-07 09:45:59', '2025-11-07 09:46:43'),
(87, 'Foco Led 9 W 220v', 'Foco Led 9 W 220v\n', 10, 0.00, 1, '2025-11-07 09:47:10', '2025-11-07 09:47:10'),
(88, 'Lampazo', 'Lampazo\n', 19, 0.00, 1, '2025-11-07 09:48:43', '2025-11-07 09:48:43'),
(89, 'Mopa', 'Mopa \n', 19, 0.00, 1, '2025-11-07 09:49:02', '2025-11-07 09:49:02'),
(90, 'Cepillo p/rueda', 'Cepillo p/lavado de ruedas\n', 19, 0.00, 1, '2025-11-07 09:49:48', '2025-11-07 09:49:48'),
(91, 'Rejilla de algodÃ³n', 'Rejilla de algodÃ³n\n', 19, 0.00, 1, '2025-11-07 09:50:09', '2025-11-07 09:50:09'),
(92, 'Gamuza', 'Gamuza\n', 19, 0.00, 1, '2025-11-07 09:50:21', '2025-11-07 09:50:21'),
(93, 'Balde p/mopa', 'Balde con escurridor p/mopa\n', 19, 0.00, 1, '2025-11-07 09:50:43', '2025-11-07 09:50:43'),
(94, 'Repuesto p/aromatizador', 'Desodorante repuesto p/aromatizador\n', 19, 0.00, 1, '2025-11-07 09:51:18', '2025-11-07 09:51:18'),
(95, 'Pilas AA 1,5v', 'Pilas AA 1,5v para aromatizadores y otros\n', 10, 0.00, 1, '2025-11-07 09:51:58', '2025-11-07 09:51:58'),
(97, 'Compresor (recambio)', 'Reparacion compresorKmorr 86 mm serie5\n', 17, 0.00, 1, '2025-11-10 11:20:37', '2025-11-10 11:20:37'),
(98, 'REP. MODULO DE PRESION DE AIRE ', '', 17, 0.00, 1, '2025-11-10 12:07:24', '2025-11-10 12:07:24'),
(99, 'Portafiltro de aceite', '', 8, 0.00, 1, '2025-11-10 12:08:38', '2025-11-10 12:08:38'),
(100, 'Tapa de compresor Vaden c/junta y tornillos', 'Tapa de compresor Vaden c/junta y tornillos proveed: Schiavone\n', 17, 0.00, 1, '2025-11-11 09:24:35', '2025-11-11 09:24:35'),
(101, 'Microfono LM68 - LEEA', 'Microfono para colectivo LD', 10, 0.00, 1, '2025-11-11 09:25:17', '2025-11-11 09:25:17'),
(102, 'Servo embrague Wabco', 'Servo embrague de motor marca Wabco', 8, 0.00, 1, '2025-11-11 09:30:22', '2025-11-11 09:30:22'),
(103, 'Yokohama 225/75R 16C', 'Cubiertas para Sprinter corta', 20, 4.00, 1, '2025-11-12 11:47:20', '2025-11-12 12:13:15'),
(104, 'Cilindro principal de freno', 'Cilindro princ de bomba de freno', 8, 0.00, 1, '2025-11-13 10:07:21', '2025-11-13 10:07:21'),
(105, 'Valvula APS - AIRE', 'Valvula APS - AIRE\n', 17, 0.00, 1, '2025-11-13 10:10:58', '2025-11-13 10:10:58'),
(106, 'Arranque 12v', 'Motor de arranque Sprinter', 10, 1.00, 1, '2025-11-13 10:13:32', '2025-11-13 10:13:32'),
(107, 'Pastillas de freno trasero 3253M', 'Pastilla de freno trasera 415', 9, 1.00, 1, '2025-11-17 09:54:39', '2025-11-17 09:54:39'),
(108, 'Pastillas de freno trasero 3285M', 'Pastilla de freno trasera 516', 9, 1.00, 1, '2025-11-17 09:55:30', '2025-11-17 09:55:30'),
(109, 'Llanta de chapa sprinter', '', 9, 0.00, 1, '2025-11-19 21:21:13', '2025-11-19 21:21:13'),
(110, 'Relay 24 v 70A c ficha', '', 10, 0.00, 1, '2025-11-20 09:33:57', '2025-11-20 09:33:57'),
(111, 'Chanchita 24V', '', 10, 0.00, 1, '2025-11-20 09:34:11', '2025-11-20 09:34:11'),
(112, 'Cree led H1', '', 18, 0.00, 1, '2025-11-20 09:34:39', '2025-11-20 09:34:39'),
(113, 'Pilas AA 1,5v', 'Pilas para aromatizadores de las unidades', 19, 0.00, 1, '2025-11-20 09:42:18', '2025-11-20 09:42:18'),
(114, 'Triangle TR 692	385/65R 22,5', 'Gomon LD', 20, 2.00, 1, '2025-11-20 09:45:49', '2025-11-20 09:45:49'),
(115, 'Gallant GL 602 315/80R 22,5', 'usadas p/recapar', 20, 2.00, 1, '2025-11-20 09:49:45', '2025-11-20 09:49:45'),
(116, 'Pirelli FR88 275/80 R22,5', 'Omnibus  usada (para recapar)\n', 20, 1.00, 1, '2025-11-20 09:50:30', '2025-11-20 09:50:30'),
(117, 'Firestone CV5000 195/75R 16c', 'Sprinter larga\n', 20, 2.00, 1, '2025-11-20 09:51:44', '2025-11-20 09:51:44'),
(118, 'Firestone CV5000 225/75 16', 'Sprinter corta\n', 20, 2.00, 1, '2025-11-20 09:52:27', '2025-11-20 09:52:27'),
(119, 'Bridgestone R249 295/80 R22,5', 'Bridgestone/Khumo omnibus   (en deposito chico)\n\n', 20, 2.00, 1, '2025-11-20 09:53:32', '2025-11-20 09:53:32'),
(120, 'Lubricante multiuso aerosol', '', 14, 0.00, 1, '2025-11-20 09:54:52', '2025-11-20 09:54:52'),
(121, 'H4 75/70 o/marcas P43T', 'NARVA Y BIFOC', 18, 0.00, 1, '2025-11-20 10:32:05', '2025-11-20 10:32:05'),
(122, 'Amortiguador eje delantero scania', '', 9, 0.00, 1, '2025-11-20 11:44:06', '2025-11-20 11:44:06'),
(123, 'Juego tornillos tapa de cilindro sprinter', '', 8, 0.00, 1, '2025-11-20 12:06:03', '2025-11-20 12:06:03'),
(124, 'Conjunto semiarmado motor sprinter', '', 8, 0.00, 1, '2025-11-20 12:06:59', '2025-11-20 12:06:59'),
(125, 'Reten salida cigueÃ±al', 'Reten salida cigueÃ±al', 8, 0.00, 1, '2025-11-22 12:15:14', '2025-11-22 12:15:14'),
(126, 'PROGRAMACION SENSOR KITAS', '', 10, 0.00, 1, '2025-11-25 11:49:37', '2025-11-25 11:49:37'),
(127, 'ARREGLO CERRAJERIA', 'Arreglos varios del cerrajero en unidades', 16, 0.00, 1, '2025-11-25 11:52:10', '2025-11-25 11:52:10'),
(128, 'Cinta aisladora grande', '', 10, 0.00, 1, '2025-11-25 12:07:54', '2025-11-25 12:07:54'),
(129, 'EstaÃ±o de un metro', '', 10, 0.00, 1, '2025-11-25 12:08:12', '2025-11-25 12:08:12'),
(130, 'Rodamiento SKF 6202', '', 8, 0.00, 1, '2025-11-25 12:09:05', '2025-11-25 12:09:05'),
(131, 'Rodamiento SKF 6303', '', 8, 0.00, 1, '2025-11-25 12:09:35', '2025-11-25 12:09:35'),
(132, 'Cubre rodamiento', '', 8, 0.00, 1, '2025-11-25 12:10:14', '2025-11-25 12:10:14'),
(133, 'Crema para limpieza de manos', '', 19, 0.00, 1, '2025-11-25 12:10:46', '2025-11-25 12:10:46'),
(134, 'WD40 grande', '', 19, 0.00, 1, '2025-11-25 12:12:36', '2025-11-25 12:12:36'),
(135, 'Llave tipo GNC', '', 10, 0.00, 1, '2025-11-25 12:13:24', '2025-11-25 12:13:24'),
(136, 'Cable p/parlante', '', 10, 0.00, 1, '2025-11-25 12:13:58', '2025-11-25 12:13:58'),
(137, 'Cable 2x1', '', 10, 0.00, 1, '2025-11-25 12:14:26', '2025-11-25 12:14:26'),
(138, 'Pegamento 8600 Negro', '', 11, 0.00, 1, '2025-11-25 12:15:03', '2025-11-25 12:15:03'),
(139, 'Fusible aereo', '', 10, 0.00, 1, '2025-11-25 12:15:28', '2025-11-25 12:15:28'),
(140, 'Bateria 9v', '', 10, 0.00, 1, '2025-11-25 12:15:52', '2025-11-25 12:15:52'),
(141, 'Cambio de presostato de baja', 'Reparacion AA', 10, 0.00, 1, '2025-11-25 12:40:19', '2025-11-25 12:40:19'),
(142, 'Cambio de relay', '', 10, 0.00, 1, '2025-11-25 12:40:41', '2025-11-25 12:40:41'),
(143, 'Cierres plasticos p/ventanillas varios', '  ', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(144, 'Cinturones de seguridad ', '  ', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(145, 'Stereo Delphi', 'A9069061000  MB', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(146, 'Soporte para martillo de emergencia', '  ', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(147, 'Guia cable soporte cortina ventanilla', '  ', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(148, 'Posavasos', '  ', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(149, 'eslinga naranja con criket', '  ', 21, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(150, 'Amortiguador maletero', '24577  NV', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(151, 'Bandeja de almacenamiento w910', 'A9106805900  w910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(152, 'Bandeja de almacenamiento w910 D', 'A9106803401  w910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(153, 'Bandeja de almacenamiento w910 I', 'A9106803301  w910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(154, 'Bisagra inf puerta carga 413/416', 'A9067400337  MBW906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(155, 'Bolsa c/ineriores plast varios w906', 'A9066880306  cod ejemploSprinter w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(156, 'Brazo corredera porton lat', 'A0007630147  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(157, 'Cadenas para nieve', '3 juegos  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(158, 'Caja  entradA de aire 907', 'A9108302601  907', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(159, 'Capot chocado sprinter', '  sprinter', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(160, 'Carro sup pta lat desliz ', 'A9067600347  Mbint 15', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(161, 'Central cierre centralizado 310cdi', 'A9068204126  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(162, 'Cerradura de capo de motor', 'A9067500450  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(163, 'Cerradura porton (anclaje) trasero', 'A9067400032  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(164, 'Cerradura porton lateral 415', 'A9067304335  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(165, 'Cerradura sup/infpta trasera sprinter', 'A9067401135  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(166, 'Cinturones de seguridad usados', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(167, 'Cubierta de herramientas w906', 'A9066840037  Sprinter w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(168, 'Cubrepilar superior derecho sprinter', 'A9066920100  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(169, 'Elementos de anclaje furgon', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(170, 'Espejo exterior iveco', '202308D  Iveco', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(171, 'Espejo retrovisor espejo solo', '55890012  MEKRA', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(172, 'espejo retrovisor redondo', 'RME046/50  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(173, 'Faro 10 led 24v AP830', 'AP830  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(174, 'Faro ambar 19 led BA730', 'BA730  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(175, 'Faro ambar 20ledML3100', 'ML3100  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(176, 'Faro ambar bivoltaje AP305', 'AP305  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(177, 'Faro ambar bivoltaje AP306', 'AP306  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(178, 'Faro ambar bivoltaje AP400', 'AP400  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(179, 'Faro ambar bivoltaje AP500', 'AP500  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(180, 'Faro ambar comun AP931', 'AP931  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(181, 'Faro ambar con ficha AP301', 'AP301  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(182, 'Faro ambar led 24v AP305', 'AP305  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(183, 'Faro ambar led 24v Ap500', 'AP500  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(184, 'Faro ambar sin  ficha AP301', 'AP301  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(185, 'Faro blanco  4 led 24v AP700', 'AP700  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(186, 'Faro blanco 6 led  Luxled', '202205  Luxled', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(187, 'Faro blanco 6 led 24v  AP560', 'AP560  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(188, 'Faro blanco 6 led bivoltaje AP706', 'AP706  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(189, 'Faro blanco comun AP931', 'AP931  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(190, 'Faro blanco led 24v AP500', 'AP500  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(191, 'Faro bllanco 3 led 24v  AP500', 'AP500  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(192, 'Faro delantero izquierdo (int 91)', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(193, 'Faro neblinero derecho (int 67)', '10334502  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(194, 'Faro plastico c/foco ambar', 'AP990  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(195, 'Faro rojo 10 led 24v AP730', 'AP730  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(196, 'Faro rojo 20 led ', 'BAIML3100  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(197, 'Faro rojo 4 led 24v AP700', 'AP700  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(198, 'Faro rojo comun  AP931', 'AP931  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(199, 'Faro trasero c/placa 907/910', 'A9108200000  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(200, 'Faro trasero colectivo LD', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(201, 'Faro trasero izquierdo (int 77)', 'A9108200000  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(202, 'Faro trasero s/placa 415/515', '910076A  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(203, 'Faro vidrio c/anclaje', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(204, 'Faro vidrio c/anclaje y ficha', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(205, 'Fuelle cableado puerta 906', 'A0009971051  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(206, 'Funda cubrevolante 45cm', 'SJ006D  china', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(207, 'Guarda plast pta der furgon w906', 'A9066900500  Sprinter w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(208, 'Guardabarros usados sprinter', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(209, 'Inerior de puerta izq w906', 'A9067270071  Sprinter w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(210, 'Interior de puerta derecha w906', 'A9067270171  Sprinter w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(211, 'Juego cinturones inerciales', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(212, 'Luz neblin lat izq 907/910', 'A9108260200  W907/910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(213, 'Manija apertura puerta', 'A9067601034  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(214, 'Maquina levantacrist elect 906', 'A9067200146  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(215, 'Mold luz neblinera del der w907/910', 'A9108854300  W907/910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(216, 'Mold luz neblinera del izq w907/910', 'A9108854400  W907/910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(217, 'Moldura cent (stereo y calefa) w906', 'A9066800017  w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(218, 'Moldura comando farol 314/416/516', 'A9106892500  314/416/516', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(219, 'Moldura panel central 416', 'A9106897000  416', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(220, 'Opticas redondas varias (n y U)', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(221, 'Panel de baliza c/tecla 313', 'A09068701010  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(222, 'Panel de control AA', 'A9079054846  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(223, 'Panel de instrumentos w907/910', 'A9106890300  w907/w910', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(224, 'Pasador para puerta', '20905  Desner', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(225, 'Pasamanos de asiento, lateral', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(226, 'Plasticos varios exterior w906', '  Sprinter w906', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(227, 'Portaobjetos lateral', 'A9106893800  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(228, 'Rejilla aireadora central w907', 'A9106801600  w907  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(229, 'Rejillas ventilacion capot sprinter', 'A9108360500  sprinter', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(230, 'Rep interior torpedo sprinter', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(231, 'Soporte chapa faros Sprinter', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(232, 'Soporte izq paragolpe Sprinter', 'A9108850400  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(233, 'Soporte motor', 'R3419  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(234, 'Tapa plast para carga de combust', 'A9067500004  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(235, 'Tapa plastica carga combustible', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(236, 'Tapagaveta portaobjetos', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(237, 'Tapas plasticas de rueda Iveco', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(238, 'Tapas plasticas de rueda MB', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(239, 'Traba porton colectivo', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(240, 'Llanta de chapa sprinter 16 unid 77', 'A9064013700  29206  MB', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(241, 'Felpudo de goma', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(242, 'Cierre rapido chico portaequip micro', '  ', 16, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(243, 'Adaptadores QKL', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(244, 'Alternador 24v', 'A0004508450  Mb', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(245, 'Alternador 413 Funcionando', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(246, 'Alternador 515/516', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(247, 'Alternador AA 24v', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(248, 'Alternador colectivo', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(249, 'Alternador colectivo 24v', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(250, 'Alternador viejo desconocido', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(251, 'Arranque 24v Omnibus', 'A0071517301  MB', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(252, 'Arranque colectivo 2v4', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(253, 'Bobina (rotor) de arranque', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(254, 'Bobina y rodamiento de arranque', '  ZM', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(255, 'Conj limpiaparab c/motor 12v', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(256, 'Cuerpo sop eje vent Aluminio', 'A4752057005  MB OH 1618/1718', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(257, 'Electroventilador', '  EBMPAPST', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(258, 'Electroventilador Em030', 'EM030  Valeo', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(259, 'Escobilla Borham HD32 32\"', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(260, 'Escobilla bosch B162 26\"', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(261, 'Escobilla QKL', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(262, 'Llave de arranque completa', 'JK3037  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(263, 'Modulo fusibles y reles 906', 'A9069006701  MB', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(264, 'Motor electroventilador', '878380VG  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(265, 'Motor limpiaparabrisas 24v', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(266, 'Placa faro trasero sprinter', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(267, 'Placa luz trasera sprinter (w906)', '3917379999  Valeo', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(268, 'PLD', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(269, 'Pulsador punto rojo 2 terminales', '  Texas', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(270, 'Rele (automatico) de arranque', 'ZM409  ZM', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(271, 'Rotor alternador', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(272, 'Tablero de instrumentos 313', 'A9069003001  MB', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(273, 'Termica 20A', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(274, 'Borne bateria positivo diesel', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(275, 'Borne bateria negativo diesel', '  ', 10, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(276, 'Abrazadera', 'A695995706  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(277, 'Abrazadera de tuberia 100mm', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(278, 'Abrazadera de tuberia 150mm', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(279, 'Ajuste aut caja (slack adjuster)', '4049  Haldex', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(280, 'Amortiguador del MB 1721/1722', 'L124486Y  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(281, 'Amortiguador delantero', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(282, 'Amortiguador delantero (int 65)', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(283, 'Amortiguador direccion scania', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(284, 'Arbol de levas', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(285, 'Aros de piston 415/515', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(286, 'Bomba agua iveco daily', '5801514155  Etore', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(287, 'Bomba de agua colectivo viejo', 'A9062010107  16210621', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(288, 'Bomba de embrague', 'CLA20002  PHC', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(289, 'Brida piñon', 'A6943537045  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(290, 'Buje de barra estabilizadora R-453', 'O500 384 320 7050  Suporte ReMB 1214/1418/O500 384 320 7050', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(291, 'Bulonesc/tuerca de rueda', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(292, 'Cable comandofreno trasero', '3400  Fremec', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(293, 'Caja aluminio p/termostato', 'A9042030474  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(294, 'Calentador', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(295, 'Canula de conex inyector', 'A5410170324  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(296, 'Caño radiador', '9065010682  Truktec', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(297, 'Cazoñeta 415/515', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(298, 'Central airbag sprinter', 'A0285015383  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(299, 'Cigüeñal', '614  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(300, 'Cil transm embr desb rapido', 'A3842950006  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(301, 'Cilindro de embrague', 'CLA20002  PHC', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(302, 'Cinta de freno colectivo nuevo', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(303, 'Cinta de freno colectivo viejo', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(304, 'Cojinete articulado', 'A0019317931  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(305, 'Cojinete de desembrague', 'A0022506515  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(306, 'Cojinete esferico', 'A0019817931  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(307, 'Comp motor colectivo de  linea', '  924/904', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(308, 'Compresor Omnibus scania', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(309, 'Condensador consep Hardex 24v', 'A310061001  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(310, 'Conjunto de embrague', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(311, 'Control remoto caldera calefaccion', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(312, 'Corona dentada', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(313, 'Corona y piñon (para reparar)', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(314, 'CORREA CONTI V', '6PK2211  MB CONTITECHA0029933296  Z001/Q002    K5157', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(315, 'Correa Micro V', 'GPK2098  gates20x2112mm', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(316, 'Correa Multi Rub', '8PK1380  Dayco', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(317, 'Correa Poly-V Belt', '7PK1515  Dayco312 Alt-servicio', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(318, 'CORREA V  MULTIRUB', '6PK2100  MB CONTITECHA0049931796/001', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(319, 'Correa V-Belt', '  MichelinAV 13X1150', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(320, 'Crapodina de embrague', '953  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(321, 'Cruceta', 'STR1-183  ETMA-MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(322, 'Cruceta usada', 'SPL140-1X5  SPICER', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(323, 'Curvas de goma radiador', 'A3685013382  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(324, 'Deposito de agua (tanque expansion)', 'A6345000049  Mb', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(325, 'Disco freno trasero', 'RPDI 04910  TRW', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(326, 'Eje accionamiento ventilador OH518', 'A4752057202  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(327, 'Embrague vent Scania P14-194', 'H0221-B  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(328, 'Embrague vent Scania P14-195', 'H0221-B  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(329, 'Enfriador 313/413', '  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(330, 'Enganche acoplado', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(331, 'Ext. selector caja cambio scania', '2684789  Scania', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(332, 'Faro espejo retrovisor sprinter', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(333, 'Filtro de aire FR-1006', 'FR-1006  Famel', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(334, 'Filtro de combustible 0986BF0024', '6BF0024  Bosch', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(335, 'Filtro deshidratador AA', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(336, 'Filtro respiradero Iveco daily', '500058321  Nexpo', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(337, 'Flexible para aceite', '  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(338, 'Flexible para liquido de frenos', 'A6654297635  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(339, 'Fuelle caja de direccion', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(340, 'Fuelle recto 22cm', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(341, 'Horquilla de desembrague', 'A0970254058  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(342, 'Inyector 415', '  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(343, 'Inyector Bosch', '  Bosch', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(344, 'Inyectores usados 313', '445110189  Bosch', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(345, 'Juego junta descarboniz OM651', '906380  elring', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(346, 'Juego juntas k16- MBB', '175637  Roloel  Caja abierta', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(347, 'Juego juntas tapa cilindro', '82904  SABO', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(348, 'Juego mordaza freno', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(349, 'Junta de tapa de valvulas', '  elring', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(350, 'Kit cadena de distribucion', 'A6510520000  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(351, 'Kit embrague', '3400000313  SachsMB913-OH1417   OM904LA', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(352, 'Kit embrague (caja de madera)', 'A0202507203Q2 306022  Valeo', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(353, 'Kit embrague Iveco', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(354, 'Kit juntas de motor s/tapa cilindro', '2132760  CICARELLI', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(355, 'Kit reparacion compresor', '1100045100  VADEN', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(356, 'Manchon 415/515', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(357, 'Manguera conformada', 'A6345011882  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(358, 'Manguera intercooler', '70/235  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(359, 'Manguera motor/radiador', 'A3845010184  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(360, 'Manguera rigida 30x2,5', '  Rigitec', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(361, 'Manguito recto silicona c/fluor', 'A4279970183  CMD', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(362, 'Manometro de presion de aire', '3246633  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(363, 'Membrana y junta', 'A0000180133  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(364, 'Pastilla de freno 3226M', '3226M  Mazfren515 DEL o TRAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(365, 'Pastilla de freno 3253M', '3253M  Mazfren311/415 TRASERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(366, 'Pastilla de freno 3270M', '3270M  Mazfren515 DELANTERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(367, 'Pastilla de freno 3285M', '3285M  Mazfren516 TRASERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(368, 'Pastilla de freno 3290M', '3290M  Mazfren416 DELANTERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(369, 'Pastilla de freno Iveco 3188M', '3188M  MazfrenIVECO DAILY  D O T', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(370, 'Pastilla de freno Iveco 3217M tras', '3217M  MazfrenIVECO DAILY  TRASERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(371, 'Pastillas de freno delantera 413', '3087/1 H  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(372, 'Pastillas de freno MB Actros', 'RCPT 05010  TRW', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(373, 'Pastillas de freno trasera 310/312/313', '3111M  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(374, 'Pastillas de freno trasera 311/313', '3171M  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(375, 'Pastillas de freno trasera 415', '3253M  311/415 TRASERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(376, 'Pastillas de freno trasera 416', '3290M  416 DELANTERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(377, 'Pastillas de freno trasera 416/516', '3270M  515 DELANTERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(378, 'Pastillas de freno trasera 515', '3233M  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(379, 'Pastillas de freno trasera 516', '3285M  516 TRASERAS', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(380, 'Pata de motor lado volante', 'A3842400018  Soporte Re', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(381, 'Pata estriada palanca cambios omnibus', 'A9702680830  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(382, 'Pedal acelerador c/cable', 'A6963007004  MB/VDO', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(383, 'Polea alternador 60mm', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(384, 'Polea doble ventilador', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(385, 'Polea para alternador', '895820/261121 MAX  IZETA', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(386, 'Polea para alternador SPRINTER', '897490/41022COST  EFR', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(387, 'Portafiltro 415/515', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(388, 'Radiador Scania', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(389, 'Registro automatico Haldex', 'SPF80305  Haldex', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(390, 'Remache cinta de freno', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(391, 'Resorte patin de freno', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(392, 'Reten angular', 'A00169976647  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(393, 'Reten celeste', '01742BR  SABO', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(394, 'Reten de eje', 'A025997504764  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(395, 'Reten masa rueda trasera 515', '1399769416  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(396, 'Reten masa trasera OF1418', '1457  Cortec', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(397, 'Reten piñon interor', 'A0159970346  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(398, 'Reten polea loca (1620)', 'OHOM904  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(399, 'Reten radial', 'A0169972346  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(400, 'Reten radial interior', 'A0149972646  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(401, 'Reten rueda tras 1318/1418/1618', '01884BRAG  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(402, 'Reten trasero polea ventilador', 'A3689970046  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(403, 'Rodamiento', 'LM501349  PEER', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(404, 'Rodamiento 3030', '6003-2RSH/6JN  SKF', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(405, 'Rodamiento cardan', 'R252R  Soporte Re', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(406, 'Rodamiento conico', 'A0199816405  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(407, 'Rodamiento conico eje ventilador', 'A6649813025  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(408, 'Rodamiento horquilla embrague Scania', '1753479  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(409, 'Rodamiento rueda (int 09)', '33214  SKF', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(410, 'Rodamiento skf 6205', '6205-2RSH/C3  SKF', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(411, 'Extremo Right', '  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(412, 'Rotula palanca de cambios omnibus', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(413, 'Selectora cambios omnibus', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(414, 'Sensor de presion MAP', '281006482  Bosch', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(415, 'Sensor nivel bidon agua 710/715/915', '9705450124  Panther', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(416, 'Sensor presion de aceite', 'A0111539228  MBBronce', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(417, 'Sensor presion sobrealimentacion', 'A0101535328  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(418, 'Sensor temperatura', 'A0041534220  DC', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(419, 'Servoembrague Wabco', 'A9700512450  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(420, 'Silenciador wabco', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(421, 'Sobrantes reparacion caldera', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(422, 'Soporte amortiguador delantero', '690  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(423, 'Soporte cardan', 'HB88509  DRQ45 mm 1417/1418', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(424, 'Soporte de motor', '3618252  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(425, 'Tapa plast cabezal filtro aceite', 'OM904/906  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(426, 'Tapon de carter', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(427, 'Tensor de correa', 'A9062004570  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(428, 'Tensor de correa de distribucion', 'A0010212113  MB413/313', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(429, 'Termostato scania (int 60)', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(430, 'Tornillo accionamiento ventilador', 'A6349900001  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(431, 'Tubo gril flex (voss)', '  Voss', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(432, 'Tubo valvula EGR', 'A6511402108  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(433, 'Tuercas de rueda', 'A0004010672  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(434, 'Unidad bombeante PLD c/urea', 'A041147990067  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(435, 'Valvula de paso', 'A6511800115  MB', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(436, 'Ventilador calefaccion', 'K3g097-bk34-43  EBM PAPST', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(437, 'Ventilador calefaccion c/radiador', 'K3g097-bk34-43  EBM PAPST', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(438, 'Volante bimasa', '  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(439, 'Rot MB sprinter 515 CDI', '19540 AP  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(440, 'Rodam trasero interior micro urb', 'FAG33020  ', 22, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(441, 'Brida conexión compresor', 'A4111476034  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(442, 'Cilindro maestro de freno', 'A005W497  MB', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(443, 'Cilindro neum de ap de puertas', '  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(444, 'Cilindros de aire viejos', '  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(445, 'Conducto de presion', 'A9062030402  MB', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(446, 'Diafragma p/freno de aire', '520  Fegom', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(447, 'Manguera de entrada de aire sprinter', 'A90652280024  MB', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(448, 'Pulmon freno camion', '  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(449, 'Servovalvula freno iveco', '  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(450, 'Soporte Filtro Axon', 'RC31502  Knorr Bremse', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(451, 'Tubo gril flex 12x10mm', '  NTH', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(452, 'Valvula aire pta emerg colectivo', '  Disel lorenz', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(453, 'Valvula freno de mano', 'DPM94B  Knorr Bremse', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(454, 'Valvula freno de servicio Wabco', '4613152460  Wabco', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(455, 'Valvula llave tire aire 1 y 2 puertas', '  Disel lorenz', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(456, 'Valvula neumatica 4 vias apu', '431163  Knorr Bremse', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(457, 'Valvula rele Wabco', 'A9730110010  MB', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(458, 'Valvula seguridad cuatro circuitos', 'A9347050050  Wabco', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(459, 'Acople rapido aire', '  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(460, 'Perilla llave depresora', '  ', 17, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(461, 'Almohadas', '  ', 23, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22'),
(462, 'Mantas ', '  ', 23, 0.00, 1, '2025-11-26 10:44:22', '2025-11-26 10:44:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbonos`
--

CREATE TABLE `tbonos` (
  `id` int NOT NULL,
  `idPersona` int NOT NULL,
  `anio` int NOT NULL,
  `mes` int NOT NULL,
  `archivo_url` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcategorias`
--

CREATE TABLE `tcategorias` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci,
  `activo` tinyint(1) DEFAULT '1',
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tcategorias`
--

INSERT INTO `tcategorias` (`id`, `nombre`, `descripcion`, `activo`, `creado_en`, `actualizado_en`) VALUES
(8, 'MOTOR', '', 1, '2025-07-23 11:18:00', '2025-07-23 11:18:00'),
(9, 'TREN DELANTERO', '', 1, '2025-07-23 11:18:33', '2025-07-23 11:18:33'),
(10, 'ELECTRICIDAD ', '', 1, '2025-07-23 11:18:43', '2025-07-23 11:18:43'),
(11, 'TAPIZADOS E INTERIORES', 'ASIENTOS Y PARTES PLASTICAS INTERIORES', 1, '2025-07-24 20:51:48', '2025-11-12 18:18:44'),
(14, 'LUBRICANTES', 'LUBRICANTES Y LIQUIDOS ', 1, '2025-11-03 20:08:03', '2025-11-03 20:09:14'),
(15, 'FILTROS', 'ELEMENTOS DE FILTRADO', 1, '2025-11-03 20:09:00', '2025-11-03 20:09:00'),
(16, 'CHAPERIA', 'CHAPERIA Y CERRAJERIA', 1, '2025-11-03 20:10:51', '2025-11-03 20:10:51'),
(17, 'NEUMATICA', 'ELEMENTOS NEUMATICOS', 1, '2025-11-03 20:12:44', '2025-11-03 20:12:44'),
(18, 'ILUMINACION', 'FOCOS UTILIZADOS', 1, '2025-11-03 20:13:42', '2025-11-03 20:13:42'),
(19, 'LIMPIEZA', 'ELEM DE LIMPIEZA DE UNIDADES', 1, '2025-11-06 12:04:30', '2025-11-06 12:04:30'),
(20, 'CUBIERTAS', 'CUBIERTAS PARA UNIDADES', 1, '2025-11-07 19:44:35', '2025-11-07 19:44:35'),
(21, 'ACCESORIOS', '', 1, '2025-11-26 06:41:18', '2025-11-26 06:41:18'),
(22, 'MECANICA', '', 1, '2025-11-26 06:42:11', '2025-11-26 06:42:11'),
(23, 'ROPA', '', 1, '2025-11-26 06:42:14', '2025-11-26 06:42:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcentrosdecarga`
--

CREATE TABLE `tcentrosdecarga` (
  `idcentro` int NOT NULL,
  `nombrecentro` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `direccioncentro` varchar(250) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tcentrosdecarga`
--

INSERT INTO `tcentrosdecarga` (`idcentro`, `nombrecentro`, `direccioncentro`) VALUES
(1, 'Mendoza Fundacional', ''),
(3, 'YPF en Ruta', ''),
(4, 'Roca - Gral.Las Heras', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcompras_detalle`
--

CREATE TABLE `tcompras_detalle` (
  `id` int NOT NULL,
  `idCompra` int NOT NULL,
  `idArticulo` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `total_neto` decimal(10,2) NOT NULL,
  `total_iva` decimal(10,2) NOT NULL,
  `total_bruto` decimal(10,2) DEFAULT NULL,
  `esnuevo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tcompras_detalle`
--

INSERT INTO `tcompras_detalle` (`id`, `idCompra`, `idArticulo`, `cantidad`, `precio_unitario`, `total_neto`, `total_iva`, `total_bruto`, `esnuevo`) VALUES
(31, 36, 103, 18.00, 275000.00, 4090909.10, 859090.90, 4950000.00, 1),
(37, 41, 21, 10.00, 182500.00, 1508264.40, 316735.60, 1825000.00, 1),
(38, 41, 20, 2.00, 196500.00, 324793.40, 68206.60, 393000.00, 1),
(39, 42, 109, 1.00, 280000.00, 231405.00, 48595.00, 280000.00, 1),
(40, 43, 14, 1.00, 210000.00, 173553.70, 36446.30, 210000.00, 1),
(41, 44, 15, 1.00, 13043.80, 10780.00, 2263.80, 13043.80, 1),
(42, 44, 14, 1.00, 19481.00, 16100.00, 3381.00, 19481.00, 1),
(43, 45, 104, 1.00, 1459533.00, 1206225.60, 253307.40, 1459533.00, 1),
(45, 47, 126, 1.00, 423500.00, 350000.00, 73500.00, 423500.00, 1),
(46, 48, 127, 2.00, 95000.00, 190000.00, 0.00, 190000.00, 1),
(47, 49, 38, 1.00, 1250.00, 1033.10, 216.90, 1250.00, 1),
(48, 49, 39, 1.00, 1500.00, 1239.70, 260.30, 1500.00, 1),
(49, 49, 128, 1.00, 5000.00, 4132.20, 867.80, 5000.00, 1),
(50, 49, 129, 1.00, 3000.00, 2479.30, 520.70, 3000.00, 1),
(51, 49, 130, 1.00, 6000.00, 4958.70, 1041.30, 6000.00, 1),
(52, 49, 131, 1.00, 12000.00, 9917.40, 2082.60, 12000.00, 1),
(53, 49, 26, 1.00, 1050.00, 867.80, 182.20, 1050.00, 1),
(54, 49, 23, 1.00, 800.00, 661.20, 138.80, 800.00, 1),
(55, 49, 27, 1.00, 700.00, 578.50, 121.50, 700.00, 1),
(56, 49, 64, 1.00, 1500.00, 1239.70, 260.30, 1500.00, 1),
(57, 49, 134, 1.00, 9600.00, 7933.90, 1666.10, 9600.00, 1),
(58, 49, 11, 1.00, 10000.00, 8264.50, 1735.50, 10000.00, 1),
(59, 49, 110, 1.00, 9000.00, 7438.00, 1562.00, 9000.00, 1),
(60, 49, 135, 1.00, 2000.00, 1652.90, 347.10, 2000.00, 1),
(61, 49, 136, 1.00, 1000.00, 826.50, 173.50, 1000.00, 1),
(62, 49, 137, 1.00, 1500.00, 1239.70, 260.30, 1500.00, 1),
(63, 49, 138, 1.00, 21000.00, 17355.40, 3644.60, 21000.00, 1),
(64, 49, 139, 1.00, 1500.00, 1239.70, 260.30, 1500.00, 1),
(65, 49, 140, 1.00, 9500.00, 7851.20, 1648.80, 9500.00, 1),
(66, 50, 141, 1.00, 326700.00, 270000.00, 56700.00, 326700.00, 1),
(67, 50, 142, 1.00, 72600.00, 60000.00, 12600.00, 72600.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcompras_encabezado`
--

CREATE TABLE `tcompras_encabezado` (
  `id` int NOT NULL,
  `fecha` datetime NOT NULL,
  `tipo_factura` enum('A','B','C','E','M','T') COLLATE utf8mb4_spanish_ci NOT NULL,
  `nro_factura` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idProveedor` int NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tcompras_encabezado`
--

INSERT INTO `tcompras_encabezado` (`id`, `fecha`, `tipo_factura`, `nro_factura`, `idProveedor`, `email`) VALUES
(36, '2025-11-07 11:50:00', 'A', '002-00011136', 16, 'mgdanielali2020@gmail.com'),
(41, '2025-10-13 18:20:00', 'A', '0006-00040709', 17, 'mgdanielali2020@gmail.com'),
(42, '2025-10-31 21:21:00', 'A', '0006-00041097', 17, 'mgdanielali2020@gmail.com'),
(43, '2025-10-31 21:21:00', 'A', '0006-00041097', 17, 'mgdanielali2020@gmail.com'),
(44, '2025-10-30 21:34:00', 'A', '00005241', 18, 'mgdanielali2020@gmail.com'),
(45, '2025-10-03 21:34:00', 'A', '0006-00041018', 17, 'mgdanielali2020@gmail.com'),
(47, '2025-11-20 11:49:00', 'A', '00003-00000205', 19, 'mgdanielali2020@gmail.com'),
(48, '2025-11-13 11:53:00', 'C', '00005-00000135', 20, 'mgdanielali2020@gmail.com'),
(49, '2025-11-04 12:16:00', 'A', '00007-00002245', 21, 'mgdanielali2020@gmail.com'),
(50, '2025-11-17 12:45:00', 'A', '00006-00000092', 22, 'mgdanielali2020@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tdocumentosvehiculo`
--

CREATE TABLE `tdocumentosvehiculo` (
  `id` int NOT NULL,
  `idVehiculo` int NOT NULL,
  `nombreArchivo` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fechaSubida` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tdocumentosvehiculo`
--

INSERT INTO `tdocumentosvehiculo` (`id`, `idVehiculo`, `nombreArchivo`, `descripcion`, `fechaSubida`) VALUES
(30, 5, 'Permiso interno 3 - AG465XE.pdf', '', '2025-08-18 19:10:27'),
(32, 5, 'poliza_33415199.pdf', '', '2025-08-18 19:15:24'),
(33, 13, 'POLIZA INT 04.pdf', '', '2025-08-18 19:22:53'),
(35, 13, 'Permiso interno 4 - AE601EE.pdf', '', '2025-08-18 19:23:26'),
(37, 52, 'POLIZA INT 05.pdf', '', '2025-08-18 19:29:27'),
(40, 52, 'Permiso interno 5 - AF932DW.pdf', '', '2025-08-18 19:30:09'),
(41, 29, 'POLIZA INT 06.pdf', '', '2025-08-18 19:37:00'),
(43, 29, 'Permiso interno 6 - AF634TH.pdf', '', '2025-08-18 19:37:16'),
(45, 30, 'POLIZA INT 07.pdf', '', '2025-08-18 19:48:20'),
(46, 30, 'Permiso interno 7 - AG475CD.pdf', '', '2025-08-18 19:48:25'),
(49, 14, 'POLIZA INT 08.pdf', '', '2025-08-18 19:54:05'),
(51, 14, 'Permiso interno 8 - AG194BT.pdf', '', '2025-08-18 19:54:17'),
(53, 15, 'POLIZA INT 09.pdf', '', '2025-08-18 20:03:31'),
(55, 15, 'Permiso interno 9 - MJN005.pdf', '', '2025-08-18 20:03:46'),
(59, 31, 'Permiso interno 10 - AC678QD.pdf', '', '2025-08-18 20:11:59'),
(60, 31, 'POLIZA INT 10.pdf', '', '2025-08-18 20:12:58'),
(62, 32, 'POLIZA INT 11.pdf', '', '2025-08-18 20:18:36'),
(64, 32, 'Permiso interno 11 - AG168XF.pdf', '', '2025-08-18 20:18:57'),
(68, 33, 'Permiso interno 14 - AH075OB.pdf', '', '2025-08-20 08:58:07'),
(69, 5, 'DESINFECCION (03).pdf', '', '2025-09-22 10:01:06'),
(70, 13, 'DESINFECCION (04).pdf', '', '2025-09-22 10:01:55'),
(74, 52, 'DESINFECCION (05).pdf', '', '2025-09-22 10:04:08'),
(75, 29, 'DESINFECCION (06).pdf', '', '2025-09-22 10:05:10'),
(76, 30, 'DESINFECCION (07).pdf', '', '2025-09-22 10:06:02'),
(77, 14, 'DESINFECCION (08).pdf', '', '2025-09-22 10:06:57'),
(78, 15, 'DESINFECCION (09).pdf', '', '2025-09-22 10:07:41'),
(79, 31, 'DESINFECCION (10).pdf', '', '2025-09-22 10:08:51'),
(80, 32, 'DESINFECCION (11).pdf', '', '2025-09-22 10:09:32'),
(81, 18, 'DESINFECCION (12).pdf', '', '2025-09-22 10:09:59'),
(82, 33, 'DESINFECCION (14).pdf', '', '2025-09-22 10:10:49'),
(83, 6, 'DESINFECCION (15).pdf', '', '2025-09-22 10:11:48'),
(84, 19, 'DESINFECCION (16).pdf', '', '2025-09-22 10:12:28'),
(85, 20, 'DESINFECCION (17).pdf', '', '2025-09-22 10:13:14'),
(86, 21, 'DESINFECCION (18).pdf', '', '2025-09-22 10:15:49'),
(88, 54, 'DESINFECCION (19).pdf', '', '2025-09-22 10:16:42'),
(89, 34, 'DESINFECCION (20).pdf', '', '2025-09-22 10:17:08'),
(90, 35, 'DESINFECCION (21).pdf', '', '2025-09-22 10:17:24'),
(91, 22, 'DESINFECCION (22).pdf', '', '2025-09-22 10:18:18'),
(92, 36, 'DESINFECCION (24).pdf', '', '2025-09-22 10:19:15'),
(93, 23, 'DESINFECCION (23).pdf', '', '2025-09-22 10:19:43'),
(94, 37, 'DESINFECCION (25).pdf', '', '2025-09-22 10:20:12'),
(95, 38, 'DESINFECCION (26).pdf', '', '2025-09-22 10:20:51'),
(96, 39, 'DESINFECCION (27).pdf', '', '2025-09-22 10:21:16'),
(97, 40, 'DESINFECCION (29).pdf', '', '2025-09-22 10:22:08'),
(98, 41, 'DESINFECCION (30).pdf', '', '2025-09-22 10:22:33'),
(99, 42, 'DESINFECCION (31).pdf', '', '2025-09-22 10:23:25'),
(100, 43, 'DESINFECCION (32).pdf', '', '2025-09-22 10:23:50'),
(101, 24, 'DESINFECCION (33).pdf', '', '2025-09-22 10:24:17'),
(102, 44, 'DESINFECCION (35).pdf', '', '2025-09-22 10:24:59'),
(103, 45, 'DESINFECCION (36).pdf', '', '2025-09-22 10:25:33'),
(104, 25, 'DESINFECCION (38).pdf', '', '2025-09-22 10:27:51'),
(105, 46, 'DESINFECCION (39).pdf', '', '2025-09-22 10:28:29'),
(106, 47, 'DESINFECCION (40).pdf', '', '2025-09-22 10:28:51'),
(107, 48, 'DESINFECCION (41).pdf', '', '2025-09-22 10:29:13'),
(108, 49, 'DESINFECCION (45).pdf', '', '2025-09-22 10:29:45'),
(109, 26, 'DESINFECCION (47).pdf', '', '2025-09-22 10:30:09'),
(110, 27, 'DESINFECCION (48).pdf', '', '2025-09-22 10:30:42'),
(111, 28, 'DESINFECCION (49).pdf', '', '2025-09-22 10:31:05'),
(112, 50, 'DESINFECCION (70).pdf', '', '2025-09-22 10:31:34'),
(113, 51, 'DESINFECCION (77).pdf', '', '2025-09-22 10:31:58'),
(114, 17, 'DESINFECCION (115).pdf', '', '2025-09-22 10:32:26'),
(115, 18, 'Permiso interno 12 - AD275DR.pdf', '', '2025-10-02 14:08:11'),
(117, 6, 'Permiso interno 15 - PHW167.pdf', '', '2025-10-02 18:43:40'),
(118, 19, 'Permiso interno 16 - AE707ZC.pdf', '', '2025-10-02 18:46:53'),
(120, 20, 'Permiso interno 17 - LVB304.pdf', '', '2025-10-02 18:49:31'),
(121, 21, 'Permiso interno 18 - AE893IL.pdf', '', '2025-10-02 18:52:11'),
(124, 34, 'Permiso interno 20 - AE692RO.pdf', '', '2025-10-02 18:56:35'),
(126, 35, 'Permiso interno 21 - AF593PH.pdf', '', '2025-10-02 18:57:38'),
(128, 22, 'Permiso interno 22 - LEW597.pdf', '', '2025-10-02 18:59:42'),
(129, 23, 'Permiso interno 23 - AF459ZY (1).pdf', '', '2025-10-02 19:00:19'),
(130, 36, 'Permiso interno 24 - LRM319 (1).pdf', '', '2025-10-02 19:01:39'),
(131, 37, 'Permiso interno 25 - OXC507.pdf', '', '2025-10-02 19:02:18'),
(132, 38, 'Permiso interno 26 - NKB771 (1).pdf', '', '2025-10-02 19:03:16'),
(133, 39, 'Permiso interno 27 - AF909WC.pdf', '', '2025-10-02 19:03:51'),
(135, 7, 'Permiso interno 28 - AA014GU.pdf', '', '2025-10-02 19:06:07'),
(136, 40, 'Permiso interno 29 - MRD554.pdf', '', '2025-10-02 19:06:30'),
(137, 41, 'Permiso interno 30 - AF151NO.pdf', '', '2025-10-02 19:09:05'),
(138, 42, 'Permiso interno 31 - AH115DS.pdf', '', '2025-10-02 19:10:06'),
(139, 43, 'Permiso interno 32 - AG606FV.pdf', '', '2025-10-02 19:11:55'),
(141, 24, 'Permiso interno 33 - AG725GZ.pdf', '', '2025-10-02 19:12:52'),
(143, 44, 'Permiso interno 35 - AG475CE.pdf', '', '2025-10-02 19:31:04'),
(145, 45, 'Permiso interno 36 - AB783TX.pdf', '', '2025-10-02 19:32:47'),
(146, 25, 'Permiso interno 38 - AD183BG.pdf', '', '2025-10-02 19:33:47'),
(147, 46, 'Permiso interno 39 - AA017TO.pdf', '', '2025-10-02 19:34:48'),
(148, 47, 'Permiso interno 40 - AB807YD.pdf', '', '2025-10-02 19:35:28'),
(149, 48, 'Permiso interno 41 - AG331DA (1).pdf', '', '2025-10-02 19:36:22'),
(151, 49, 'Permiso interno 45 - AB854WF (1).pdf', '', '2025-10-02 19:37:47'),
(152, 26, 'Permiso interno 47 - OXT450.pdf', '', '2025-10-02 19:52:19'),
(153, 27, 'Permiso interno 48 - PKP989.pdf', '', '2025-10-02 19:53:21'),
(156, 54, 'TV Interno 19 AH262YF.pdf', '', '2025-10-03 09:45:31'),
(157, 54, 'Titulo interno 19 - AH262YF.pdf', '', '2025-10-03 09:45:46'),
(159, 54, 'Permiso INT 19 - vto 05.06.26.pdf', '', '2025-10-03 09:48:14'),
(160, 58, 'Titulo Interno 34 - AH446GK.pdf', '', '2025-10-03 10:00:12'),
(161, 58, 'Tarjeta verde Interno 34 - AH446GK.pdf', '', '2025-10-03 10:01:19'),
(162, 45, 'TV Interno 36 AB783TX.pdf', '', '2025-10-03 10:01:44'),
(164, 47, 'TV Interno 40 AB807YD.pdf', '', '2025-10-03 10:02:19'),
(165, 60, 'Titulo Int 83 AD890AA.pdf', '', '2025-10-03 10:02:53'),
(166, 17, 'Titulo Int 115 - AH261XK.pdf', '', '2025-10-03 10:03:14'),
(167, 42, 'TV Interno 31 AH115DS.pdf', '', '2025-10-03 10:03:33'),
(168, 5, 'TV Interno 3 AG465XE - Carrozada.pdf', '', '2025-10-03 10:04:29'),
(170, 52, 'TV Interno 5 AF932DW - Carrozada.pdf', '', '2025-10-03 10:05:14'),
(171, 52, 'Titulo interno 05 AF932DW - Carrozada.pdf', '', '2025-10-03 10:05:22'),
(172, 8, 'titulo Interno 91 - AF733CQ.pdf', '', '2025-10-03 10:05:51'),
(173, 5, 'Titulo interno 03 AG465XE - Carrozada.pdf', '', '2025-10-03 10:06:30'),
(174, 46, 'TV interno 39 AA017TO.pdf', '', '2025-10-03 10:06:50'),
(175, 49, 'TV interno 45 AB854WF.pdf', '', '2025-10-03 10:07:05'),
(176, 33, 'TV interno 14 AH075OB.pdf', '', '2025-10-03 10:07:39'),
(177, 59, 'TV Interno 13 AG810HF.pdf', '', '2025-10-03 10:07:51'),
(178, 33, 'Titulo interno 14 AH075OB.pdf', '', '2025-10-03 10:08:04'),
(179, 42, 'Titulo interno 31.pdf', '', '2025-10-03 10:08:18'),
(180, 49, 'Titulo interno 45 AB854WF.pdf', '', '2025-10-03 10:08:38'),
(181, 16, 'Titulo interno 105 AD378IK.pdf', '', '2025-10-03 10:09:13'),
(182, 59, 'Titulo Interno 13 AG810HF.pdf', '', '2025-10-03 10:09:49'),
(183, 45, 'titulo interno 36  AB783TX.pdf', '', '2025-10-03 10:10:20'),
(184, 16, 'TV 105 AD378IK.pdf', '', '2025-10-03 10:10:33'),
(185, 24, 'Titulo Interno 33 AG725GZ.pdf', '', '2025-10-03 10:11:00'),
(186, 47, 'titulo interno 40 AB807YD.pdf', '', '2025-10-03 10:11:21'),
(187, 43, 'TV Interno 32.pdf', '', '2025-10-03 10:11:44'),
(188, 46, 'Titulo interno 39 AA017TO.pdf', '', '2025-10-03 10:12:01'),
(191, 38, 'TV Interno 26.pdf', '', '2025-10-03 10:14:10'),
(192, 43, 'Titulo interno 32 AG606FV.pdf', '', '2025-10-03 10:14:33'),
(193, 30, 'TV interno 07 AG475CD.pdf', '', '2025-10-03 10:14:51'),
(194, 44, 'titulo Interno 35 AG475CE.pdf', '', '2025-10-03 10:15:10'),
(195, 30, 'titulo Interno 07 AG475CD.pdf', '', '2025-10-03 10:16:23'),
(196, 48, 'TV Interno 41 AG312DA.pdf', '', '2025-10-03 10:16:37'),
(197, 28, 'TV interno 49 AF711LL.pdf', '', '2025-10-03 10:16:52'),
(198, 40, 'TV Interno 29 MRD554.pdf', '', '2025-10-03 10:17:07'),
(199, 25, 'TV interno 38 AD183BG.pdf', '', '2025-10-03 10:17:26'),
(201, 25, 'titulo Interno 38 AD183BG.pdf', '', '2025-10-03 10:18:29'),
(202, 48, 'TITULO INTERNO 41 AG331DA.pdf', '', '2025-10-03 10:18:44'),
(203, 37, 'TV Interno 25 OXC507.pdf', '', '2025-10-03 10:19:04'),
(204, 14, 'TV interno 08 AG194BT.pdf', '', '2025-10-03 10:19:30'),
(205, 51, 'TV Interno 77 AG081IM.pdf', '', '2025-10-03 10:19:53'),
(206, 32, 'TV Interno 11 AG168XF.pdf', '', '2025-10-03 10:20:08'),
(207, 14, 'titulo interno 08 AG194BT.pdf', '', '2025-10-03 10:20:28'),
(208, 35, 'tv interno 21 AF593PH.pdf', '', '2025-10-03 10:21:23'),
(209, 29, 'titulo interno 06 AF634TH.pdf', '', '2025-10-03 10:21:41'),
(210, 39, 'TV Interno 27 AF909WC.pdf', '', '2025-10-03 10:21:53'),
(211, 50, 'tv interno 70 AG084GF.pdf', '', '2025-10-03 10:22:07'),
(212, 29, 'TV Interno 06 AF634TH.pdf', '', '2025-10-03 10:22:26'),
(213, 39, 'Titulo interno 27 AF909WC.pdf', '', '2025-10-03 10:26:28'),
(214, 51, 'Titulo interno 77 AG008IM.pdf', '', '2025-10-03 10:26:43'),
(215, 32, 'Titulo Interno 11 AG168XF.pdf', '', '2025-10-03 10:27:43'),
(216, 28, 'Titulo interno 49 AF711LL.pdf', '', '2025-10-03 10:28:03'),
(217, 40, 'Titulo interno 29 MRD554.pdf', '', '2025-10-03 10:28:20'),
(218, 50, 'Titulo Interno 70 AG084GF.pdf', '', '2025-10-03 10:28:35'),
(219, 35, 'Titulo interno 21 AF593PH.pdf', '', '2025-10-03 10:28:50'),
(220, 13, 'Titulo interno 04 AE601EE.pdf', '', '2025-10-03 10:29:03'),
(221, 23, 'Titulo Interno 23 AE459ZY.pdf', '', '2025-10-03 10:29:40'),
(222, 15, 'TV interno 9 MNJ005.pdf', '', '2025-10-03 10:30:01'),
(223, 23, 't.v. Interno 23 AF459ZY.pdf', '', '2025-10-03 10:30:19'),
(224, 15, 'titulo INTERNO 9 MJN005.pdf', '', '2025-10-03 10:30:34'),
(225, 22, 'titulo interno 22 LEW597.pdf', '', '2025-10-03 10:32:04'),
(226, 41, 'TV Interno 30 AF151NO.pdf', '', '2025-10-03 10:32:19'),
(227, 36, 'titulo interno 24 LRM319.pdf', '', '2025-10-03 10:32:31'),
(228, 41, 'titulo interno 30 AF151NO.pdf', '', '2025-10-03 10:32:46'),
(229, 22, 'TV Interno 22 LEW597.pdf', '', '2025-10-03 10:33:00'),
(230, 36, 'TV int. 24 LRM319.pdf', '', '2025-10-03 10:33:36'),
(231, 21, 'titulo interno 18 AE893IL.pdf', '', '2025-10-03 10:33:48'),
(232, 21, 'TV Interno 18 AE893IL.pdf', '', '2025-10-03 10:34:12'),
(233, 19, 'titulo interno 16 AE707ZC.pdf', '', '2025-10-03 10:34:30'),
(234, 34, 'TV interno 20 AE692RO.pdf', '', '2025-10-03 10:34:43'),
(235, 34, 'TITULO Interno 20 AE692RO.pdf', '', '2025-10-03 10:34:53'),
(236, 19, 'T.V. Interno 16 AE707ZC.pdf', '', '2025-10-03 10:35:05'),
(237, 37, 'titulo interno 25 OXC507.pdf', '', '2025-10-03 10:35:40'),
(238, 20, 'tv 17 LVB304.pdf', '', '2025-10-03 10:35:51'),
(239, 7, 'TITULO Interno 28 AA014GU.pdf', '', '2025-10-03 10:38:01'),
(240, 20, 'titulo Interno 17 LVB304.pdf', '', '2025-10-03 10:38:16'),
(241, 6, 'TITULO Interno 15 PHW167.pdf', '', '2025-10-03 10:38:32'),
(242, 7, 'tv 28 AA014GU.pdf', '', '2025-10-03 10:38:44'),
(243, 38, 'titulo interno 26 NKB771.pdf', '', '2025-10-03 10:38:57'),
(244, 44, 'Tarjeta verde 35 AG475CE.pdf', '', '2025-10-03 10:39:22'),
(245, 18, 'SEGURO INT 12.pdf', '', '2025-10-03 10:40:21'),
(246, 19, 'SEGURO INT 16.pdf', '', '2025-10-03 10:42:25'),
(247, 21, 'SEGURO INT 18.pdf', '', '2025-10-03 10:43:38'),
(248, 54, 'SEGURO INT 19.pdf', '', '2025-10-03 10:45:57'),
(249, 34, 'SEGURO INT 20.pdf', '', '2025-10-03 10:46:32'),
(250, 35, 'SEGURO INT 21.pdf', '', '2025-10-03 10:46:56'),
(251, 39, 'SEGURO INT 27.pdf', '', '2025-10-03 10:47:30'),
(252, 43, 'SEGURO INT 32.pdf', '', '2025-10-03 10:49:11'),
(253, 24, 'TV_interno_33 AG725GZ.pdf', '', '2025-10-03 10:49:17'),
(254, 58, 'SEGURO INT 34.pdf', '', '2025-10-03 10:50:01'),
(255, 44, 'SEGURO INT 35.pdf', '', '2025-10-03 10:50:27'),
(256, 48, 'SEGURO INT 41.pdf', '', '2025-10-03 10:50:52'),
(257, 50, 'SEGURO INT 70.pdf', '', '2025-10-03 10:51:19'),
(258, 51, 'SEGURO INT 77.pdf', '', '2025-10-03 10:51:40'),
(259, 50, 'Permiso interno 70 - AG084GF.pdf', '', '2025-10-03 12:25:46'),
(260, 51, 'Permiso interno 77 - AG008IM.pdf', '', '2025-10-03 12:27:15'),
(261, 60, 'Permiso interno 83.pdf', '', '2025-10-03 12:27:43'),
(262, 16, 'Permiso interno 105 - AD378IK.pdf', '', '2025-10-03 12:28:41'),
(263, 17, 'Permiso interno 115.pdf', '', '2025-10-03 12:29:52'),
(264, 5, 'SEGURO INT 03.pdf', '', '2025-10-03 19:06:12'),
(266, 13, 'SEGURO INT 04.pdf', '', '2025-10-03 19:08:28'),
(267, 52, 'SEGURO INT 05.pdf', '', '2025-10-03 19:10:05'),
(268, 29, 'SEGURO INT 06.pdf', '', '2025-10-03 19:12:01'),
(269, 30, 'SEGURO INT 07.pdf', '', '2025-10-03 19:14:50'),
(270, 14, 'SEGURO INT 08.pdf', '', '2025-10-03 19:15:53'),
(271, 31, 'SEGURO INT 10.pdf', '', '2025-10-03 19:19:09'),
(272, 32, 'SEGURO INT 11.pdf', '', '2025-10-03 19:20:27'),
(273, 33, 'SEGURO INT 14.pdf', '', '2025-10-03 19:22:30'),
(274, 35, 'PERMISO NACIONAL CNRT.pdf', '', '2025-10-03 20:06:26'),
(275, 16, 'PERMISO NACIONAL CNRT.pdf', '', '2025-10-03 20:07:47'),
(276, 25, 'PERMISO NACIONAL CNRT.pdf', '', '2025-10-03 20:08:53'),
(277, 8, 'PERMISO NACIONAL CNRT.pdf', '', '2025-10-03 20:09:33'),
(278, 17, 'PERMISO NACIONAL CNRT.pdf', '', '2025-10-03 20:09:53'),
(279, 60, 'PERMISO NACIONAL CNRT.pdf', '', '2025-10-03 20:10:12'),
(280, 28, 'SEGURO INT 49.pdf', '', '2025-10-03 21:04:45'),
(281, 59, 'SEGURO INT 13.pdf', '', '2025-10-03 21:24:39'),
(282, 6, 'SEGURO INT 15.pdf', '', '2025-10-03 21:25:02'),
(283, 20, 'SEGURO INT 17.pdf', '', '2025-10-03 21:25:21'),
(284, 23, 'SEGURO INT 23.pdf', '', '2025-10-03 21:25:39'),
(285, 41, 'SEGURO INT 30.pdf', '', '2025-10-03 21:26:22'),
(286, 42, 'SEGURO INT 31.pdf', '', '2025-10-03 21:26:38'),
(287, 24, 'SEGURO INT 33.pdf', '', '2025-10-03 21:26:59'),
(288, 26, 'SEGURO INT 47.pdf', '', '2025-10-03 21:29:18'),
(289, 27, 'SEGURO INT 48.pdf', '', '2025-10-03 21:29:35'),
(291, 22, 'SEGURO INT 22.pdf', '', '2025-10-04 09:28:48'),
(292, 36, 'SEGURO INT 24.pdf', '', '2025-10-04 09:29:15'),
(293, 38, 'SEGURO INT 26.pdf', '', '2025-10-04 09:29:45'),
(294, 45, 'SEGURO INT 36.pdf', '', '2025-10-04 09:30:12'),
(295, 46, 'SEGURO INT 39.pdf', '', '2025-10-04 09:30:32'),
(296, 47, 'SEGURO INT 40.pdf', '', '2025-10-04 09:30:50'),
(297, 49, 'SEGURO INT 45.pdf', '', '2025-10-04 09:31:10'),
(298, 15, 'SEGURO INT 9.pdf', '', '2025-10-04 09:31:38'),
(299, 7, 'SEGURO INT 28.pdf', '', '2025-10-04 09:52:39'),
(300, 13, 'TECNICA INT 04.pdf', '', '2025-10-04 12:25:54'),
(301, 52, 'TECNICA INT 05.pdf', '', '2025-10-04 12:26:11'),
(302, 29, 'TECNICA INT 06.pdf', '', '2025-10-04 12:26:25'),
(303, 30, 'TECNICA INT 07.pdf', '', '2025-10-04 12:26:50'),
(304, 14, 'TECNICA INT 08.pdf', '', '2025-10-04 12:27:30'),
(305, 15, 'TECNICA INT 09.pdf', '', '2025-10-04 12:27:41'),
(306, 31, 'TECNICA INT 10.pdf', '', '2025-10-04 12:27:53'),
(307, 32, 'TECNICA INT 11.pdf', '', '2025-10-04 12:28:11'),
(309, 59, 'TECNICA INT 13.pdf', '', '2025-10-04 12:28:39'),
(310, 33, 'TECNICA INT 14.pdf', '', '2025-10-04 12:28:55'),
(311, 6, 'TECNICA INT 15.pdf', '', '2025-10-04 12:30:20'),
(314, 21, 'TECNICA INT 18.pdf', '', '2025-10-04 12:33:15'),
(315, 54, 'TECNICA INT 19.pdf', '', '2025-10-04 12:35:10'),
(316, 34, 'TECNICA INT 20.pdf', '', '2025-10-04 12:35:34'),
(317, 35, 'TECNICA INT 21.pdf', '', '2025-10-04 12:36:00'),
(318, 22, 'TECNICA INT 22.pdf', '', '2025-10-04 12:36:16'),
(319, 23, 'TECNICA INT 23.pdf', '', '2025-10-04 12:36:31'),
(320, 36, 'TECNICA INT 24.pdf', '', '2025-10-04 12:36:46'),
(321, 37, 'TECNICA INT 25.pdf', '', '2025-10-04 12:37:00'),
(322, 39, 'TECNICA INT 27.pdf', '', '2025-10-04 12:42:07'),
(324, 40, 'TECNICA INT 29.pdf', '', '2025-10-04 12:42:40'),
(326, 42, 'TECNICA INT 31.pdf', '', '2025-10-04 12:43:07'),
(327, 43, 'TECNICA INT 32.pdf', '', '2025-10-04 12:43:21'),
(328, 24, 'TECNICA INT 33.pdf', '', '2025-10-04 12:43:36'),
(329, 58, 'TECNICA INT 34.pdf', '', '2025-10-04 12:43:58'),
(330, 44, 'TECNICA INT 35.pdf', '', '2025-10-04 12:45:26'),
(332, 46, 'TECNICA INT 39.pdf', '', '2025-10-04 12:46:58'),
(333, 47, 'TECNICA INT 40.pdf', '', '2025-10-04 12:47:15'),
(334, 48, 'TECNICA INT 41.pdf', '', '2025-10-04 12:47:29'),
(336, 26, 'TECNICA INT 47.pdf', '', '2025-10-04 12:48:11'),
(337, 27, 'TECNICA INT 48.pdf', '', '2025-10-04 12:48:27'),
(339, 51, 'TECNICA INT 77.pdf', '', '2025-10-04 12:49:37'),
(340, 60, 'TECNICA INT 83.pdf', '', '2025-10-04 12:49:54'),
(341, 16, 'TECNICA INT 105.pdf', '', '2025-10-04 12:50:29'),
(342, 59, 'DESINFECCION INT 13.pdf', '', '2025-10-04 13:06:42'),
(343, 59, 'Permiso interno 13 - AG810HF.pdf', '', '2025-10-04 13:08:21'),
(344, 58, 'Permiso interno 34 - Vto 12.09.26.pdf', '', '2025-10-04 13:09:10'),
(345, 58, 'DESINFECCION INT 34.pdf', '', '2025-10-04 13:09:25'),
(346, 8, 'TECNICA NACIONAL INT 91.pdf', '', '2025-10-07 11:08:14'),
(347, 31, 'TITULO INT 10 AC678QD.pdf', '', '2025-10-07 11:29:43'),
(348, 18, 'TITULO INT 12 AD275DR.pdf', '', '2025-10-07 11:30:18'),
(350, 26, 'TARJETA VERDE 47 OXT450.pdf', '', '2025-10-07 11:32:12'),
(351, 31, 'TARJETA VERDE  10.pdf', '', '2025-10-07 11:33:38'),
(352, 18, 'TARJETA VERDE 12.pdf', '', '2025-10-07 11:34:10'),
(353, 6, 'TARJETA VERDE 15 PHW167.pdf', '', '2025-10-07 11:34:27'),
(354, 27, 'TARJETA VERDE 48 PKP989.pdf', '', '2025-10-07 11:34:56'),
(355, 26, 'TITULO INT 47.pdf', '', '2025-10-07 18:12:44'),
(356, 27, 'TITULO INT 48.pdf', '', '2025-10-07 18:13:02'),
(357, 17, 'TECNICA INT 115.pdf', '', '2025-10-07 18:16:49'),
(358, 8, 'SEGURO INT 91.pdf', '', '2025-10-07 18:29:48'),
(359, 16, 'SEGURO INT 105.pdf', '', '2025-10-07 18:30:15'),
(360, 17, 'SEGURO INT 115.pdf', '', '2025-10-07 18:44:15'),
(361, 60, 'SEGURO INT 83.pdf', '', '2025-10-07 18:45:58'),
(362, 13, 'TARJETA VERDE 04.pdf', '', '2025-10-07 19:09:32'),
(363, 37, 'SEGURO INT 25.pdf', '', '2025-10-08 12:08:06'),
(364, 5, 'POLIZA INT 03 14-2-26.pdf', '', '2025-10-18 11:09:00'),
(365, 5, 'DESINF. OCT INT 03.pdf', '', '2025-10-18 11:09:15'),
(366, 5, 'SEG OCT INT 03.pdf', '', '2025-10-18 11:09:34'),
(367, 13, 'SEG OCT INT 04.pdf', '', '2025-10-18 11:09:56'),
(368, 13, 'DESINF. OCT INT 4.pdf', '', '2025-10-18 11:10:10'),
(369, 13, 'POLIZA INT 04 6-12-25.pdf', '', '2025-10-18 11:10:27'),
(370, 52, 'POLIZA INT 05 24-5-26.pdf', '', '2025-10-18 11:10:45'),
(371, 52, 'DESINF. OCT INT 5.pdf', '', '2025-10-18 11:10:56'),
(372, 52, 'SEG OCT INT 05.pdf', '', '2025-10-18 11:11:05'),
(374, 29, 'DESINF. OCT INT 6.pdf', '', '2025-10-18 11:11:39'),
(375, 29, 'POLIZA INT 06 31-10-25.pdf', '', '2025-10-18 11:11:49'),
(376, 30, 'POLIZA INT 07 28-2-26.pdf', '', '2025-10-18 11:12:04'),
(377, 30, 'DESINF. OCT INT 7.pdf', '', '2025-10-18 11:12:19'),
(378, 30, 'SEG OCT INT 07.pdf', '', '2025-10-18 11:12:32'),
(379, 14, 'SEG OCT INT 08.pdf', '', '2025-10-18 11:12:50'),
(380, 14, 'DESINF. OCT INT 8.pdf', '', '2025-10-18 11:13:03'),
(381, 14, 'POLIZA INT 08 14-5-26.pdf', '', '2025-10-18 11:13:12'),
(382, 15, 'POLIZA INT 09 15-12-25.pdf', '', '2025-10-18 11:13:27'),
(383, 15, 'SEG OCT INT 09.pdf', '', '2025-10-18 11:13:39'),
(385, 15, 'DESINF. OCT INT 9.pdf', '', '2025-10-18 11:14:03'),
(386, 31, 'DESINF. OCT INT 10.pdf', '', '2025-10-18 11:14:31'),
(387, 31, 'POLIZA INT 10 15-3-26.pdf', '', '2025-10-18 11:14:42'),
(388, 31, 'SEG OCT INT 10.pdf', '', '2025-10-18 11:14:51'),
(389, 32, 'SEG OCT INT 11.pdf', '', '2025-10-18 11:16:16'),
(390, 32, 'DESINF. OCT INT 11.pdf', '', '2025-10-18 11:16:39'),
(391, 32, 'POLIZA INT 11 15-4-26.pdf', '', '2025-10-18 11:16:48'),
(392, 18, 'POLIZA INT 12 5-01-2026.pdf', '', '2025-10-18 11:17:13'),
(393, 18, 'SEG OCT INT 12.pdf', '', '2025-10-18 11:26:44'),
(394, 18, 'DESINF. OCT INT 12.pdf', '', '2025-10-18 13:08:42'),
(395, 59, 'DESINF. OCT INT 13.pdf', '', '2025-10-18 13:08:55'),
(396, 59, 'SEG OCT INT 13.pdf', '', '2025-10-18 13:09:05'),
(397, 59, 'POLIZA INT 13 15-3-26.pdf', '', '2025-10-18 13:09:11'),
(398, 33, 'POLIZA INT 14 16-1-26.pdf', '', '2025-10-18 13:09:29'),
(399, 33, 'DESINF. OCT INT 14.pdf', '', '2025-10-18 13:09:37'),
(400, 33, 'SEG OCT INT 14.pdf', '', '2025-10-18 13:09:45'),
(401, 6, 'SEG OCT INT 15.pdf', '', '2025-10-18 13:09:59'),
(402, 6, 'DESINF. OCT INT 15.pdf', '', '2025-10-18 13:10:08'),
(403, 6, 'POLIZA INT 15 15-3-26.pdf', '', '2025-10-18 13:10:17'),
(404, 19, 'POLIZA INT 16 5-1-26.pdf', '', '2025-10-18 13:10:31'),
(405, 19, 'DESINF. OCT INT 16.pdf', '', '2025-10-18 13:10:40'),
(406, 19, 'SEG OCT INT 16.pdf', '', '2025-10-18 13:10:50'),
(407, 20, 'SEG OCT INT 17.pdf', '', '2025-10-18 13:11:55'),
(408, 20, 'DESINF. OCT INT 17.pdf', '', '2025-10-18 13:12:05'),
(409, 20, 'POLIZA INT 17 15-3-26.pdf', '', '2025-10-18 13:12:13'),
(410, 21, 'POLIZA INT 18 15-4-26.pdf', '', '2025-10-18 13:12:28'),
(413, 54, 'SEG OCT INT 19.pdf', '', '2025-10-18 13:13:20'),
(414, 54, 'POLIZA INT 19 13-6-26.pdf', '', '2025-10-18 13:13:28'),
(415, 54, 'DESINF. OCT INT 19.pdf', '', '2025-10-18 13:13:35'),
(416, 34, 'DESINF. OCT INT 20.pdf', '', '2025-10-18 13:13:50'),
(417, 34, 'POLIZA INT 20 8-9-26.pdf', '', '2025-10-18 13:13:59'),
(418, 34, 'SEG OCT INT 20.pdf', '', '2025-10-18 13:14:09'),
(422, 35, 'DESINF. OCT INT 21.pdf', '', '2025-10-18 13:15:00'),
(423, 22, 'DESINF. OCT INT 22.pdf', '', '2025-10-18 13:15:17'),
(424, 22, 'POLIZA INT 22 15-12-25.pdf', '', '2025-10-18 13:15:24'),
(425, 22, 'SEG OCT INT 22.pdf', '', '2025-10-18 13:15:32'),
(426, 23, 'SEG OCT INT 23.pdf', '', '2025-10-18 13:15:50'),
(427, 23, 'POLIZA INT 23 15-3-26.pdf', '', '2025-10-18 13:15:58'),
(428, 23, 'DESINF. OCT INT 23.pdf', '', '2025-10-18 13:16:06'),
(429, 36, 'DESINF. OCT INT 24.pdf', '', '2025-10-18 13:16:27'),
(430, 36, 'POLIZA INT 24 15-12-25.pdf', '', '2025-10-18 13:16:38'),
(431, 36, 'SEG OCT INT 24.pdf', '', '2025-10-18 13:16:46'),
(432, 37, 'SEG OCT INT 25.pdf', '', '2025-10-18 13:17:01'),
(433, 37, 'POLIZA INT 25 15-12-25.pdf', '', '2025-10-18 13:17:14'),
(434, 37, 'DESINF. OCT INT 25.pdf', '', '2025-10-18 13:17:22'),
(435, 38, 'DESINF. OCT INT 26.pdf', '', '2025-10-18 13:17:44'),
(436, 38, 'POLIZA INT 26 15-12-25.pdf', '', '2025-10-18 13:17:51'),
(437, 38, 'SEG OCT INT 26.pdf', '', '2025-10-18 13:17:59'),
(438, 39, 'SEG OCT INT 27.pdf', '', '2025-10-18 13:23:35'),
(439, 39, 'POLIZA INT 27 14-5-26.pdf', '', '2025-10-18 13:23:43'),
(440, 39, 'DESINF. OCT INT 27.pdf', '', '2025-10-18 13:24:09'),
(441, 7, 'DESINF. OCT INT 28.pdf', '', '2025-10-18 13:24:28'),
(442, 7, 'POLIZA INT 28 15-3-26.pdf', '', '2025-10-18 13:24:37'),
(443, 7, 'SEG OCT INT 28.pdf', '', '2025-10-18 13:24:46'),
(444, 40, 'SEG OCT INT 29.pdf', '', '2025-10-18 13:25:04'),
(445, 40, 'POLIZA INT 29 15-12-25.pdf', '', '2025-10-18 13:25:15'),
(446, 40, 'DESINF. OCT  INT 29.pdf', '', '2025-10-18 13:25:38'),
(447, 41, 'DESINF. OCT INT 30.pdf', '', '2025-10-18 13:25:56'),
(448, 41, 'POLIZA INT 30 15-3-26.pdf', '', '2025-10-18 13:26:06'),
(449, 41, 'SEG OCT INT 30.pdf', '', '2025-10-18 13:26:15'),
(450, 42, 'SEG OCT INT 31.pdf', '', '2025-10-18 13:26:32'),
(451, 42, 'POLIZA INT 31 15-3-26.pdf', '', '2025-10-18 13:26:40'),
(452, 42, 'DESINF. OCT INT 31.pdf', '', '2025-10-18 13:26:49'),
(453, 43, 'DESINF. OCT INT 32.pdf', '', '2025-10-18 13:27:04'),
(454, 43, 'POLIZA INT 32 19-6-26.pdf', '', '2025-10-18 13:27:15'),
(455, 43, 'SEG OCT INT 32.pdf', '', '2025-10-18 13:27:24'),
(456, 24, 'SEG OCT INT 33.pdf', '', '2025-10-18 13:27:42'),
(457, 24, 'POLIZA INT 33 15-3-26.pdf', '', '2025-10-18 13:27:49'),
(458, 24, 'DESINF. OCT INT 33.pdf', '', '2025-10-18 13:27:57'),
(459, 58, 'SEG OCT INT 34.pdf', '', '2025-10-18 13:28:27'),
(460, 58, 'POLIZA INT 34 2-9-26.pdf', '', '2025-10-18 13:28:35'),
(461, 44, 'POLIZA INT 35 28-2-26.pdf', '', '2025-10-18 13:30:24'),
(462, 44, 'DESINF. OCT INT 35.pdf', '', '2025-10-18 13:30:32'),
(463, 44, 'SEG OCT INT 35.pdf', '', '2025-10-18 13:30:40'),
(464, 45, 'DESINF. OCT INT 36.pdf', '', '2025-10-18 13:31:16'),
(465, 45, 'POLIZA INT 36 15-12-25.pdf', '', '2025-10-18 13:31:23'),
(466, 45, 'SEG OCT INT 36.pdf', '', '2025-10-18 13:31:30'),
(467, 25, 'SEG OCT INT 38.pdf', '', '2025-10-18 13:31:55'),
(468, 25, 'POLIZA INT 38 15-10-26.pdf', '', '2025-10-18 13:32:02'),
(469, 25, 'DESINF. OCT INT 38.pdf', '', '2025-10-18 13:32:12'),
(470, 46, 'DESINF. OCT INT 39.pdf', '', '2025-10-18 13:32:30'),
(471, 46, 'POLIZA INT 39 15-12-25.pdf', '', '2025-10-18 13:32:39'),
(472, 46, 'SEG OCT INT 39.pdf', '', '2025-10-18 13:32:48'),
(473, 47, 'SEG OCT INT 40.pdf', '', '2025-10-18 13:33:06'),
(474, 47, 'POLIZA INT 40 15-12-25.pdf', '', '2025-10-18 13:33:13'),
(475, 47, 'DESINF. OCT INT 40.pdf', '', '2025-10-18 13:33:21'),
(476, 48, 'DESINF. OCT INT 41.pdf', '', '2025-10-18 13:33:38'),
(477, 48, 'POLIZA INT 41 15-4-26.pdf', '', '2025-10-18 13:33:47'),
(478, 48, 'SEG OCT INT 41.pdf', '', '2025-10-18 13:33:56'),
(479, 49, 'SEG OCT INT 45.pdf', '', '2025-10-18 13:34:21'),
(480, 49, 'POLIZA INT 45 24-10-25.pdf', '', '2025-10-18 13:34:28'),
(481, 49, 'DESINF. OCT INT 45.pdf', '', '2025-10-18 13:34:37'),
(482, 26, 'DESINF. OCT INT 47.pdf', '', '2025-10-18 13:36:50'),
(483, 26, 'POLIZA INT 47 15-3-26.pdf', '', '2025-10-18 13:37:02'),
(484, 26, 'SEG OCT INT 47.pdf', '', '2025-10-18 13:37:11'),
(485, 27, 'SEG OCT INT 48.pdf', '', '2025-10-18 13:38:08'),
(486, 27, 'POLIZA INT 48 15-3-26.pdf', '', '2025-10-18 13:38:17'),
(487, 27, 'DESINF. OCT INT 48.pdf', '', '2025-10-18 13:38:25'),
(488, 28, 'DESINF. OCT INT 49.pdf', '', '2025-10-18 13:38:43'),
(489, 28, 'POLIZA INT 49 5-1-26.pdf', '', '2025-10-18 13:38:50'),
(490, 28, 'SEG OCT INT 49.pdf', '', '2025-10-18 13:39:01'),
(491, 50, 'SEG OCT INT 70.pdf', '', '2025-10-18 13:39:53'),
(492, 50, 'POLIZA INT 70 15-4-26.pdf', '', '2025-10-18 13:40:01'),
(493, 50, 'DESINF. OCT INT 70.pdf', '', '2025-10-18 13:40:16'),
(494, 51, 'DESINF. OCT INT 77.pdf', '', '2025-10-18 13:41:32'),
(495, 51, 'POLIZA INT 77 15-4-26.pdf', '', '2025-10-18 13:41:42'),
(496, 51, 'SEG OCT INT 77.pdf', '', '2025-10-18 13:41:52'),
(497, 60, 'POLIZA INT 83 15-10-26.pdf', '', '2025-10-18 13:48:37'),
(498, 60, 'SEG OCT INT 83.pdf', '', '2025-10-18 13:48:45'),
(499, 8, 'POLIZA INT 91 15-10-26.pdf', '', '2025-10-18 13:49:21'),
(500, 8, 'SEG OCT INT 91.pdf', '', '2025-10-18 13:52:28'),
(501, 16, 'DESINF. OCT INT 105.pdf', '', '2025-10-18 13:53:04'),
(502, 16, 'POLIZA INT 105 15-10-26.pdf', '', '2025-10-18 13:53:15'),
(503, 16, 'SEG OCT INT 105.pdf', '', '2025-10-18 13:53:24'),
(504, 17, 'POLIZA INT 115 15-10-26.pdf', '', '2025-10-18 13:53:47'),
(505, 17, 'SEG OCT INT 115.pdf', '', '2025-10-18 13:53:54'),
(506, 5, 'RTO. PROV. INT 03.pdf', '', '2025-10-20 10:27:59'),
(507, 35, 'POLIZA INT 21 27-10-26.pdf', '', '2025-10-27 19:22:14'),
(508, 61, 'TARJETA VERDE INT 102.pdf', '', '2025-10-27 20:45:53'),
(509, 61, 'TITULO INT 102.pdf', '', '2025-10-27 20:45:59'),
(510, 61, 'POLIZA INT 102 15-11-25.pdf', '', '2025-10-27 20:46:09'),
(511, 61, 'CNRT PARQUE MOVIL.pdf', '', '2025-10-27 20:52:52'),
(512, 49, 'POLIZA INT 45 24-01-26.pdf', '', '2025-10-28 19:52:46'),
(514, 29, 'POLIZA INT 06 31-10-2026.pdf', '', '2025-10-28 19:59:11'),
(515, 21, 'SEG OCT INT 18.pdf', '', '2025-11-03 11:01:20'),
(516, 21, 'DESINF. OCT INT 18.pdf', '', '2025-11-03 11:01:40'),
(517, 17, 'DESINF. OCT INT 115.pdf', '', '2025-11-05 11:31:57'),
(518, 17, 'TARJETA VERDE INT 115.pdf', '', '2025-11-05 11:32:13'),
(519, 29, 'SEG OCT INT 06.pdf', '', '2025-11-05 19:42:34'),
(520, 49, 'TECNICA INT 45.pdf', '', '2025-11-06 09:50:24'),
(521, 35, 'SEG OCT INT 21.pdf', '', '2025-11-06 10:36:53'),
(522, 45, 'TECNICA INT 36.pdf', '', '2025-11-06 12:01:07'),
(523, 8, 'TARJETA VERDE INT 91.pdf', '', '2025-11-06 19:04:40'),
(524, 25, 'TECNICA INT 38.pdf', '', '2025-11-17 09:06:53'),
(525, 20, 'TECNICA INT 17.pdf', '', '2025-11-17 09:07:24'),
(526, 7, 'TECNICA INT 28.pdf', '', '2025-11-17 09:08:27'),
(527, 5, 'SEGURO NOV INT 03.pdf', '', '2025-11-17 19:19:25'),
(528, 13, 'SEGURO NOV INT 04.pdf', '', '2025-11-17 19:20:05'),
(529, 52, 'SEGURO NOV INT 05.pdf', '', '2025-11-17 19:20:25'),
(530, 29, 'SEGURO NOV INT 06.pdf', '', '2025-11-17 19:20:48'),
(531, 30, 'SEGURO NOV INT 07.pdf', '', '2025-11-17 19:21:06'),
(532, 14, 'SEGURO NOV INT 08.pdf', '', '2025-11-17 19:21:24'),
(533, 15, 'SEGURO NOV INT 09.pdf', '', '2025-11-17 19:21:41'),
(534, 31, 'SEGURO NOV INT 10.pdf', '', '2025-11-17 19:23:43'),
(535, 32, 'SEGURO NOV INT 11.pdf', '', '2025-11-17 19:24:02'),
(536, 18, 'SEGURO NOV INT 12.pdf', '', '2025-11-17 19:24:18'),
(537, 59, 'SEGURO NOV INT 13.pdf', '', '2025-11-17 19:24:36'),
(538, 33, 'SEGURO NOV INT 14.pdf', '', '2025-11-17 19:24:53'),
(539, 6, 'SEGURO NOV INT 15.pdf', '', '2025-11-17 19:25:06'),
(540, 19, 'SEGURO NOV INT 16.pdf', '', '2025-11-17 19:25:25'),
(541, 20, 'SEGURO NOV INT 17.pdf', '', '2025-11-17 19:25:40'),
(542, 21, 'SEGURO NOV INT 18.pdf', '', '2025-11-17 19:25:54'),
(543, 54, 'SEGURO NOV INT 19.pdf', '', '2025-11-17 19:26:09'),
(544, 34, 'SEGURO NOV INT 20.pdf', '', '2025-11-17 19:26:23'),
(545, 35, 'SEGURO NOV INT 21.pdf', '', '2025-11-17 19:26:40'),
(546, 22, 'SEGURO NOV INT 22.pdf', '', '2025-11-17 19:26:52'),
(547, 23, 'SEGURO NOV INT 23.pdf', '', '2025-11-17 19:27:07'),
(548, 36, 'SEGURO NOV INT 24.pdf', '', '2025-11-17 19:27:20'),
(549, 37, 'SEGURO NOV INT 25.pdf', '', '2025-11-17 19:27:35'),
(550, 38, 'SEGURO NOV INT 26.pdf', '', '2025-11-17 19:27:51'),
(551, 39, 'SEGURO NOV INT 27.pdf', '', '2025-11-17 19:28:05'),
(552, 7, 'SEGURO NOV INT 28.pdf', '', '2025-11-17 19:30:45'),
(553, 40, 'SEGURO NOV INT 29.pdf', '', '2025-11-17 19:31:02'),
(554, 41, 'SEGURO NOV INT 30.pdf', '', '2025-11-17 19:31:16'),
(555, 42, 'SEGURO NOV INT 31.pdf', '', '2025-11-17 19:31:31'),
(556, 43, 'SEGURO NOV INT 32.pdf', '', '2025-11-17 19:31:45'),
(557, 24, 'SEGURO NOV INT 33.pdf', '', '2025-11-17 19:32:02'),
(558, 58, 'SEGURO NOV INT 34.pdf', '', '2025-11-17 19:32:18'),
(559, 44, 'SEGURO NOV INT 35.pdf', '', '2025-11-17 19:32:41'),
(560, 45, 'SEGURO NOV INT 36.pdf', '', '2025-11-17 19:32:55'),
(561, 25, 'SEGURO NOV INT 38.pdf', '', '2025-11-17 19:33:11'),
(562, 47, 'SEGURO NOV INT 40.pdf', '', '2025-11-17 19:33:28'),
(563, 48, 'SEGURO NOV INT 41.pdf', '', '2025-11-17 19:33:44'),
(564, 49, 'SEGURO NOV INT 45.pdf', '', '2025-11-17 19:34:07'),
(565, 26, 'SEGURO NOV INT 47.pdf', '', '2025-11-17 19:34:26'),
(566, 27, 'SEGURO NOV INT 48.pdf', '', '2025-11-17 19:34:42'),
(567, 28, 'SEGURO NOV INT 49.pdf', '', '2025-11-17 19:34:56'),
(568, 50, 'SEGURO NOV INT 70.pdf', '', '2025-11-17 19:35:17'),
(569, 51, 'SEGURO NOV INT 77.pdf', '', '2025-11-17 19:35:32'),
(570, 60, 'SEGURO NOV INT 83.pdf', '', '2025-11-17 19:35:52'),
(571, 8, 'SEGURO NOV INT 91.pdf', '', '2025-11-17 19:36:10'),
(572, 61, 'SEGURO NOV INT 102.pdf', '', '2025-11-17 19:36:28'),
(573, 16, 'SEGURO NOV INT 105.pdf', '', '2025-11-17 19:36:46'),
(574, 17, 'SEGURO NOV INT 115.pdf', '', '2025-11-17 19:37:02'),
(575, 18, 'TECNICA INT 12.pdf', '', '2025-11-18 13:22:28'),
(576, 19, 'TECNICA INT 16.pdf', '', '2025-11-18 13:22:55'),
(577, 41, 'TECNICA INT 30.pdf', '', '2025-11-25 10:17:21'),
(578, 50, 'TECNICA INT 70.pdf', '', '2025-11-25 10:17:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tempresas`
--

CREATE TABLE `tempresas` (
  `id` int NOT NULL,
  `razon_social` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuit` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen_firma` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tempresas`
--

INSERT INTO `tempresas` (`id`, `razon_social`, `cuit`, `imagen_firma`, `fecha_creacion`) VALUES
(2, 'Map SAS', '30-71613623-6', 'firma_30_71613623_6_1756381693.png', '2025-08-28 11:48:13'),
(3, 'Transpol SRL', '30-70936768-0', 'firma_30_70936768_0_1756381942.png', '2025-08-28 11:52:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tobligacionesrol`
--

CREATE TABLE `tobligacionesrol` (
  `id` int NOT NULL,
  `idRol` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `loTiene` tinyint(1) DEFAULT '0',
  `vencimiento` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tobligacionesrol`
--

INSERT INTO `tobligacionesrol` (`id`, `idRol`, `nombre`, `loTiene`, `vencimiento`) VALUES
(19, 10, 'CARNET DE CONDUCIR', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tobligacionesvehiculo`
--

CREATE TABLE `tobligacionesvehiculo` (
  `id` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `lotiene` tinyint(1) NOT NULL DEFAULT '1',
  `tienevencimiento` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tobligacionesvehiculo`
--

INSERT INTO `tobligacionesvehiculo` (`id`, `nombre`, `lotiene`, `tienevencimiento`) VALUES
(11, 'TECNICA PROVINCIAL', 1, 1),
(12, 'SEGURO DE CIRCULACION', 1, 1),
(13, 'MATAFUEGO', 1, 1),
(14, 'TECNICA NACIONAL', 1, 1),
(15, 'PERMISO DE TRANSPORTE ', 1, 1),
(16, 'POLIZA DE SEGURO', 1, 1),
(17, 'DESINFECCION', 1, 1),
(18, 'FRANJA DE INGRESO', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tpermisos`
--

CREATE TABLE `tpermisos` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tpermisos`
--

INSERT INTO `tpermisos` (`id`, `nombre`) VALUES
(1, 'Acceso completo'),
(2, 'Stock'),
(3, 'Vehiculos'),
(4, 'RRHH'),
(5, 'Monitoreo'),
(6, 'Seguridad'),
(7, 'Administracion'),
(8, 'Sistemas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tpermisos_detalle`
--

CREATE TABLE `tpermisos_detalle` (
  `id` int NOT NULL,
  `idPermiso` int NOT NULL,
  `ruta` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tpermisos_detalle`
--

INSERT INTO `tpermisos_detalle` (`id`, `idPermiso`, `ruta`) VALUES
(20, 1, '/inicio'),
(23, 1, '/articulos'),
(24, 1, '/categorias'),
(25, 1, '/vehiculos'),
(26, 1, '/roles'),
(27, 1, '/personas'),
(28, 1, '/rrhh'),
(29, 1, '/obligacionesrol'),
(30, 1, '/vencimientosrol'),
(31, 1, '/monitoreorol'),
(32, 1, '/obligacionesvehiculo'),
(33, 1, '/asignacionobligacionesvehiculo'),
(34, 1, '/vencimientosvehiculo'),
(35, 1, '/monitoreovehiculo'),
(36, 1, '/usovehiculo'),
(37, 1, '/proveedores'),
(38, 1, '/compras'),
(39, 1, '/usuarios'),
(41, 1, '/serviciosvehiculo'),
(42, 1, '/stock'),
(43, 1, '/ajustes'),
(47, 2, '/articulos'),
(48, 2, '/categorias'),
(49, 2, '/proveedores'),
(50, 2, '/compras'),
(51, 2, '/ajustes'),
(52, 3, '/vehiculos'),
(54, 3, '/serviciosvehiculo'),
(55, 3, '/obligacionesvehiculo'),
(56, 3, '/asignacionobligacionesvehiculo'),
(57, 3, '/vencimientosvehiculo'),
(59, 4, '/roles'),
(60, 4, '/obligacionesrol'),
(61, 4, '/personas'),
(62, 4, '/rrhh'),
(65, 4, '/vencimientosrol'),
(66, 5, '/monitoreorol'),
(67, 5, '/monitoreovehiculo'),
(68, 5, '/stock'),
(69, 6, '/permisosextra'),
(73, 2, '/inicio'),
(74, 3, '/inicio'),
(83, 7, '/bonosadmin'),
(85, 7, '/inicio'),
(86, 5, '/inicio'),
(87, 4, '/inicio'),
(88, 6, '/inicio'),
(89, 6, '/grupodepermisos'),
(90, 6, '/permisospormodulo'),
(92, 5, '/monitorbonos'),
(93, 1, '/documentosvehiculo'),
(94, 8, '/grupodepermisos'),
(95, 8, '/permisospormodulo'),
(96, 8, '/permisosextrausuario'),
(97, 8, '/inicio'),
(98, 8, '/articulos'),
(99, 8, '/categorias'),
(100, 8, '/proveedores'),
(101, 8, '/compras'),
(102, 8, '/ajustes'),
(103, 8, '/obligacionesvehiculo'),
(104, 8, '/vehiculos'),
(105, 8, '/asignacionobligacionesvehiculo'),
(106, 8, '/vencimientosvehiculo'),
(108, 8, '/usovehiculo'),
(109, 8, '/documentosvehiculo'),
(110, 8, '/roles'),
(112, 8, '/personas'),
(113, 8, '/rrhh'),
(114, 8, '/vencimientosrol'),
(115, 8, '/bonosadmin'),
(117, 8, '/monitoreorol'),
(118, 8, '/monitoreovehiculo'),
(119, 8, '/monitorbonos'),
(120, 8, '/stock'),
(121, 8, '/serviciosvehiculo'),
(122, 8, '/obligacionesrol'),
(127, 8, '/verbonosensistema'),
(128, 1, '/verbonosensistema'),
(129, 7, '/verbonosensistema'),
(130, 7, '/empresas'),
(131, 8, '/empresas'),
(132, 3, '/centroscarga'),
(135, 8, '/usovehiculo'),
(136, 8, '/centroscarga'),
(137, 8, '/tiposcombustible'),
(138, 3, '/tiposcombustible'),
(139, 3, '/usovehiculo'),
(140, 5, '/monitorservicios'),
(142, 1, '/centroscarga'),
(143, 1, '/tiposcombustible'),
(144, 8, '/monitorservicios'),
(145, 3, '/serviciosmonitoreables'),
(146, 1, '/serviciosmonitoreables'),
(147, 8, '/serviciosmonitoreables'),
(148, 5, '/monitorcombustible'),
(149, 8, '/monitorcombustible'),
(150, 3, '/monitorcombustible'),
(151, 3, '/documentosvehiculo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tpermisos_usuario_extra`
--

CREATE TABLE `tpermisos_usuario_extra` (
  `id` int NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ruta` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tpermisos_usuario_extra`
--

INSERT INTO `tpermisos_usuario_extra` (`id`, `email`, `ruta`) VALUES
(60, 'mgdanielali2020@gmail.com', '/ajustes'),
(56, 'mgdanielali2020@gmail.com', '/articulos'),
(54, 'mgdanielali2020@gmail.com', '/asignacionobligacionesvehiculo'),
(62, 'mgdanielali2020@gmail.com', '/categorias'),
(55, 'mgdanielali2020@gmail.com', '/compras'),
(51, 'mgdanielali2020@gmail.com', '/monitoreovehiculo'),
(63, 'mgdanielali2020@gmail.com', '/monitorservicios'),
(57, 'mgdanielali2020@gmail.com', '/obligacionesvehiculo'),
(61, 'mgdanielali2020@gmail.com', '/proveedores'),
(53, 'mgdanielali2020@gmail.com', '/serviciosvehiculo'),
(52, 'mgdanielali2020@gmail.com', '/stock'),
(58, 'mgdanielali2020@gmail.com', '/vehiculos'),
(59, 'mgdanielali2020@gmail.com', '/vencimientosvehiculo'),
(29, 'transpol.srl.mza@gmail.com', '/asignacionobligacionesvehiculo'),
(30, 'transpol.srl.mza@gmail.com', '/categorias'),
(31, 'transpol.srl.mza@gmail.com', '/compras'),
(32, 'transpol.srl.mza@gmail.com', '/documentosvehiculo'),
(33, 'transpol.srl.mza@gmail.com', '/obligacionesrol'),
(34, 'transpol.srl.mza@gmail.com', '/obligacionesvehiculo'),
(35, 'transpol.srl.mza@gmail.com', '/personas'),
(36, 'transpol.srl.mza@gmail.com', '/proveedores'),
(37, 'transpol.srl.mza@gmail.com', '/roles'),
(38, 'transpol.srl.mza@gmail.com', '/rrhh'),
(39, 'transpol.srl.mza@gmail.com', '/serviciosvehiculo'),
(40, 'transpol.srl.mza@gmail.com', '/stock'),
(41, 'transpol.srl.mza@gmail.com', '/usovehiculo'),
(42, 'transpol.srl.mza@gmail.com', '/vehiculos'),
(43, 'transpol.srl.mza@gmail.com', '/vencimientosrol'),
(44, 'transpol.srl.mza@gmail.com', '/vencimientosvehiculo'),
(45, 'transpolsrl@gmail.com', '/bonosadmin'),
(49, 'transpolsrl@gmail.com', '/empresas'),
(46, 'transpolsrl@gmail.com', '/monitorbonos'),
(48, 'transpolsrl@gmail.com', '/permisosextrausuario'),
(50, 'transpolsrl@gmail.com', '/permisospormodulo'),
(47, 'transpolsrl@gmail.com', '/verbonos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tpersonas`
--

CREATE TABLE `tpersonas` (
  `id` int NOT NULL,
  `legajo` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `dni` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `nacimiento` date DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `id_empresa` int DEFAULT NULL,
  `sexo` enum('M','F','X') COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_spanish_ci,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `whatsapp` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `clave_hash` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tpersonas`
--

INSERT INTO `tpersonas` (`id`, `legajo`, `dni`, `nombre`, `apellido`, `nacimiento`, `fecha_ingreso`, `id_empresa`, `sexo`, `direccion`, `telefono`, `whatsapp`, `clave_hash`) VALUES
(14, '', '30108238', 'Ana Gabriela', 'Pollicino', '1983-05-08', '2004-05-04', 3, 'F', 'Caseros 1691, Godoy Cruz', NULL, '2616110305', '$2y$10$7oR9WH4TM/5c/lRgoAcENOIyuQe9jght/sDqT.X42JE4h4UKXfStq'),
(16, '84', '26872026', 'Nelson Javier', 'Alday', '1978-12-18', '2020-10-01', 3, 'M', 'Martin Guemes 3047, Las Heras', NULL, '2616521622', '$2y$10$z6BiW1nUnBPlNcjg/eCLdOHZZIGanOB9NNwTeC5k9v0dRGyqy2UES'),
(17, '130', '20335173', 'Leonardo', 'Carmona', '1969-01-07', '2024-01-23', 3, 'M', 'CONSTITUCION 75 MEDRANO', NULL, '2634616191', '$2y$10$jtvZsfODdAEdkJYnQq6ub.0Wn1.4/TPlGNZuOUSWQVTMhxFvp.qKC'),
(18, '127', '27101781', 'Damian Carlos', 'Amaya', '1979-03-11', '2023-12-01', 3, 'M', 'Barrio Hogar del Trabajador, MC C8, Ugarteche', NULL, '2614722591', '$2y$10$7tmVdk9urZI4WSdtNM3ArulcLXW.yjQ/Eq14AO/Y94sOUwaOYyiSu'),
(20, '121', '27062238', 'Oscar Gaston', 'Atencio', '1978-12-18', '2023-08-01', 3, 'M', 'Salta 773, Godoy Cruz', NULL, '2616163850', '$2y$10$pEo4NU6eqVntBy2URGKVOOph6O1wQ1myAbXlqJzOS.La1FvTl32Je'),
(21, '', '92612567', 'LEANDRO', 'CHAVEZ', '1958-07-22', '2024-01-15', 3, 'M', 'JACINTO SUAREZ 677 LAS HERAS', NULL, '2613439904', NULL),
(22, '147', '31266909', 'LEONARDO', 'CORIA', '1984-12-13', '2025-03-01', 3, 'M', 'BÂº MARTIN FIERRO MZA-D CASA 7 TUPUNGATO', NULL, '2622255840', '$2y$10$0e8MwwEzgsP2RhEVMagEWODX0QB4I795H4EwD6h2TuoY8NaeRnRCW'),
(23, '89', '35547205', 'Cristian Facundo', 'Arce', '1992-02-09', '2024-09-08', 3, 'M', 'Los Alamos 293, el Borbollon', NULL, '2612079506', '$2y$10$ZRv8eoh0GDQWn7K.wFCPBOGlvS3.crFWd9JpdMK1.2yYHbyiRERxm'),
(24, '', '14428152', 'DANIEL', 'CICALA', '1961-09-03', '2021-01-01', 3, 'M', 'MITRE 982 LAS HERAS', NULL, '2615697776', NULL),
(25, '96', '39677930', 'Juan Ignacio ', 'Blanco Falasca', '1997-02-13', '2023-03-27', 3, 'M', '9 de Julio 2151, Las Heras', NULL, '2634180027', '$2y$10$tdHBDKnkECGnPEQk2qO6iO5mSpcha.1eVyvQQqaR3vwy.RjbGmM.u'),
(26, '148', '23240245', 'GABRIEL ', 'CORNEJO', '1973-03-17', '2025-06-04', 3, 'M', 'J.B.PALACIOS 267 BÂº CAVAGNARO MAIPU', NULL, '2612397362', '$2y$10$rvtCcxF6GzITcypkWzorse1pNF5XioOUUrl8WYpnuniApD14xEf1G'),
(27, '73', '28225605', 'Carolina Elizabeth', 'Brizuela', '1980-09-19', '2022-07-05', 2, 'F', 'Aristotobulo del Valle 2267, Las Heras', NULL, '2615981034', '$2y$10$wZXMiGRxQQlSIqtmhR6RlugLyMmNy2auWMdu.XZ0GF75op3.jNMqe'),
(28, '96', '35879403', 'ALEXIS', 'ESPINA MOLINA', '1991-03-26', '2024-07-01', 2, 'M', 'SAN MIIGUEL 2027 LAS HERAS', NULL, '2616808888', '$2y$10$HwoaZc2ajGah28fnxuo8Eu.2uTaCDv/xxnIHktN7P64mNsdMCjuu.'),
(29, '146', '41338880', 'Cristian Agustin', 'Canto', '1998-07-07', '2025-03-01', 3, 'M', 'Ortiz 47, Las Heras', NULL, '2616205021', '$2y$10$o3bAgcUFUPBjSNIF2k6XyeTLe/jysMNUHCxmMRaWhiFgLXbMRJhQC'),
(30, '8', '17258909', 'CARLOS', 'FERNANDEZ', '1965-06-08', '2010-03-01', 3, 'M', 'SAN MIGUEL 2984 LAS HERAS', NULL, '2616762351', '$2y$10$izZas3pAfbBkHEqKm20W0edQHkZuGkJFnZ/BZFIBT43gC7sPnWzWa'),
(31, '', '12778447', 'Carlos Ramon', 'Canto', '1959-02-27', '2025-02-24', 3, 'M', 'P B Palacios 41, Vista Flores - Tunuyan', NULL, '2622680304', NULL),
(32, '134', '32909739', 'JONATHAN', 'FERNANDEZ', '1987-07-21', '2024-06-01', 3, 'M', 'CARRIL NORTE S/N BUEN ORDEN- SAN MARTIN', NULL, '2634511685', '$2y$10$R9dFtMdyotoBzJnIFNWjfug8AJFlJr1FBG46dXSkYlRt55tu4jPC2'),
(33, '90', '33053563', 'EZEQUIEL EDUARDO', 'FERNANDEZ RUFINO', '1987-08-12', '2024-01-26', 2, 'M', 'AGUSTIN ALVAREZ 2136 LAS HERAS', NULL, '2617571360', '$2y$10$8ZcQE4OFRnb1Djdi/zOomOxv8sVyb33beECtWd2.1q3DQaHCwAj2m'),
(34, '55', '20887672', 'Sergio Gustavo', 'Carrillo', '1969-09-12', '2014-07-22', 3, 'M', 'Sargento Cabral 847 piso 7 depto 5, Godoy Cruz', NULL, '2614728384', '$2y$10$bHfxbsmj54apylxIl91k7uU/AUM0qY0CwywHk8lQUreFgS/DXKixS'),
(36, '67', '34308316', 'Maximiliano Alejandro', 'Cardea', '1988-12-13', '2022-12-01', 3, 'M', 'Castellanos 185 depto 2, Dorrego', NULL, '2613048809', '$2y$10$BTsMPrHUitegVmzSaD7bs.doM4aEMNJWwST8Um4oi0pIB/IYvxnN.'),
(37, '97', '39377396', 'ENZO EZEQUIEL ', 'FERNANDEZ ORREGO', '1996-02-11', '2024-10-07', 2, 'M', 'PASO DE LOS ANDES 464 LAS HERAS', NULL, '26170072952', '$2y$10$NO/HrU.CHcK3g200LKx2iOsVUfgTciMrt4Rr0b6jd2IxBboX4tw0i'),
(38, '', '11413227', 'RAUL RODOLFO ', 'FERREYRA', '1954-10-10', '2022-08-15', 3, 'M', 'PASO HONDO 2580 LAS HERAS', NULL, '2616587687', NULL),
(39, '126', '23389257', 'Humberto Francisco', 'Lacroux', '1973-04-17', '2023-11-01', 3, 'M', 'Brandsend 790, Perdriel', NULL, '2612429467', '$2y$10$AvPwez0UxV5ipOgAr7.sJOSvNtCrvgkcVDIX/v3kAyrhruUj8QAvm'),
(40, '89', '44746306', 'IGNACIO SEBASTIAN', 'FLORES', '2002-01-16', '2023-12-01', 2, 'M', 'DOCTOR MORENO 3828 LAS HERAS', NULL, '2614176936', '$2y$10$y.tAu6rwCRt/hcTVP3GRiOgunIQOhly3rPs2nipTWQMyQwDpVORxm'),
(41, '143', '34753664', 'Natalio Matias', 'Lopez', '1989-08-13', '2024-11-19', 3, 'M', 'Sarmiento 2421, Las Heras', NULL, '2614666862', '$2y$10$2aGWYiNePAwtX/Q/oHq7b.On0Syo43WnoW9GaF1q8rx0/MUhOX1R6'),
(42, '123', '34025853', 'PABLO ROMAN', 'GARAY', '1988-09-27', '2023-07-01', 3, 'M', 'CACIQUE GUAYMALLEN 2590 LAS HERAS', NULL, '2616998282', '$2y$10$wuSwWwO4kZ.DjxlBy3nu0..jNANXe.XYQTWAvA1YcTwG0RYqsq5m6'),
(43, '81', '38207021', 'Alexis Joel ', 'Lozano Esposito', '1994-04-26', '2023-05-09', 2, 'M', 'Barrio Infanta M14 C18, Las Heras', NULL, '2616822778', '$2y$10$VwXB2L30QLJ3a5e5iX6TzuH8htdEb0f0T8myhgKlNkRL6Y6Rh/gCO'),
(44, '142', '24058172', 'Hector Eduardo', 'Lujan', '1974-09-11', '2024-10-28', 3, 'M', 'Barrio El Encuentro MB C12, Perdriel', NULL, '2613382678', '$2y$10$Pv7beE4Le2hkSDOS5FEPZucH/CpXcQ8tk0IGwRmhCn9WqZWY0H.4C'),
(45, '95', '33517935', 'Ciro Carlos Daniel', 'Ghilardi', '1987-09-10', '2024-06-01', 2, 'M', 'SALTA 3018 CIUDAD-4TA SECCION', NULL, '2612417609', '$2y$10$zXBwPTBCWjWw48jO.mrzsugKQW2Ad4Zu5UbBaWciOlpXLQughf4GS'),
(46, '133', '17744953', 'Osvaldo Raul', 'Martinez', '1966-03-10', '2024-06-01', 3, 'M', 'Juan Gualberto Godoy 126, Godoy Cruz', NULL, '265691009', '$2y$10$BHVjmN.z7..kntxavly4eu/FD8lTzK/dmo7xOp1MJdMuznYhgS8zq'),
(47, '72', '20626136', 'WALTER OSVALDO', 'GIAMPORTONE', '1969-01-15', '2018-07-04', 3, 'M', 'NOGOLI 641 BÂº VANDOR GODOY CRUZ', NULL, '2613048808', '$2y$10$QHjcRZtlDZwXXbmKtVq/u.PX8/APoPrVJRxueLLeipfbPC74x3tNC'),
(48, '137', '26595183', 'JOSE FERNANDO', 'GONZALEZ', '1978-07-29', '2024-10-01', 3, 'M', 'BÂº SANTA ROSA M-H C-44 \nLAS HERAS', NULL, '2616474707', '$2y$10$bDk8mn3FuBYjfKfNWaNvXuS3shQcPID5DFkONwtknI1ZeRLDv.2n.'),
(49, '63', '41885399', 'ARIEL HUGO', 'GOMEZ', '1988-10-24', '2022-02-07', 2, 'M', 'ARENAS 644 EL ALGARROBAL LAS HERAS', NULL, '2612374843', '$2y$10$t7glwWIEkBmxOClZ3vtXpOzzIOKKVG.lR.GXbXvdfvLK4Hb.Cgmum'),
(50, '150', '29787821', 'Sebastian Alejandro', 'Manzo', '1982-08-24', '2025-07-15', 3, 'M', 'Esmeralda 6418, Buena Nueva', NULL, '2612447337', '$2y$10$FhqND.KV/NC7tQKS2XYcXuzHOEOv.SvUpeWFWU5FjvMF9hFvkTQt2'),
(52, '46', '16061879', 'ANGEL ALBERTO', 'GUTIERREZ', '1962-02-27', '2013-04-08', 3, 'M', 'ALVAREZ CONDARCO 483 SAN MARTIN', NULL, '2634365683', '$2y$10$bzvexmnEUbZ7RNCIkxTv9O7jAb26N/UO2EPyw.DK5xxBiFanA/bza'),
(53, '75', '26828602', 'RAUL ROBERTO', 'GUTIERREZ', '1978-11-28', '2021-09-01', 3, 'M', 'BÂº LAS VIÃ‘AS EL ALGARROBAL LAS HERAS', NULL, '2617450241', '$2y$10$prM7fSVbcsE6BDLdtwE9Mu8L3JBCWOirzfamFoIJZiq572JcKeTCa'),
(54, '116', '22316397', 'JESUS GUSTAVO', 'JOFRE', '1971-11-28', '2023-02-06', 3, 'M', 'LA TOTORA 4798 EL ALGARROBAL LAS HERAS', NULL, '2613990970', '$2y$10$.8Sz7eKD8YlBEUhuQI0h6O7jCvTUzTLY92bCM6LzSfjQ5VJH3M0e2'),
(55, '141', '36134788', 'Daniel Fernando', 'Nievas', '1991-12-28', '2024-10-24', 3, 'M', 'BÂº ALVAREZ CONDARCO MZA-H C-19 LAS HERAS', NULL, '2616893555', '$2y$10$sHxsnOqg5/laSsmBLOqGl.FUggLaAQECJFC3/y0.dmsGs49fPoLj2'),
(57, '118', '16474497', 'Sergio Alberto', 'Martinez', '1963-11-22', '2023-05-02', 3, 'M', 'Sargento Cabral 2773, Las Heras', NULL, '2613396587', '$2y$10$uX446a9k5yaKQkcapPi3g.gsAXogQLsB6QquURuhdqGPlXg.4EN0W'),
(58, '108', '24225490', 'GABRIEL ANTONIO', 'REPETTO', '1975-02-19', '2022-04-25', 3, 'M', 'MOLINERO TEJEDA 1346 LAS HERAS', NULL, '2634667519', '$2y$10$wusrwKOPifW4bW.UGp.xZu22d78R9.a8jtMGzitt2m0zi/BVSaA3u'),
(59, '', '22090376', 'Gabriel Alberto', 'Micheletti', '1971-10-02', '2022-09-01', 3, 'M', 'Barrio Smata2 MG C21, Las Heras', NULL, '2615038782', NULL),
(60, '', '32034118', 'LUIS PAULO', 'RIVERO', '1985-12-26', '2024-06-15', 3, 'M', 'BÂº CASTILLO MZA-C C-9 UGARTECHE LUJAN DE CUYO', NULL, '2615551420', NULL),
(61, '138', '30571009', 'Pablo Emanuel', 'Moyano', '1983-12-03', '2024-10-01', 3, 'M', 'Barrio Bonfantti San Juan 2569, Las Heras', NULL, '2612120566', '$2y$10$yv9et5kgWqE/zoK1LY5gYu6XiUsbh2KcqHSirw1SLyqArcv6VWUSi'),
(62, '106', '40940426', 'GABRIEL MAIDANA ', 'ROMERO', '1998-01-01', '2024-03-21', 3, 'M', 'BÂº MURCIA MZA-B C-25 PEDRIEL LUJAN DE CUYO', NULL, '2612528064', '$2y$10$5snlJgDcgi2rerlcCpWlIu/4MUuw3qbL8NYPE/4EgRm0zzFw.SphK'),
(63, '', '13396065', 'CARLOS DANIEL', 'ROMERO PEREYRA', '1957-08-11', '2022-05-02', 3, 'M', 'MANUELA SAENZ 1043 LAS HERAS', NULL, '2613890748', NULL),
(64, '79', '24207056', 'Alberto Ceferino', 'Rosales', '1975-02-24', '2019-09-10', 3, 'M', 'BÂº JARDIN AEROPARQUE MZA-5 C-19 LAS HERAS', NULL, '2614196406', '$2y$10$F62WvFwqCxud0Ny/VILfLutIYdezhWjOhygPk5/S96Cag/qGfYFrK'),
(65, '', '18052373', 'DANIEL EDGARDO', 'SAMBATARO', '1967-06-30', '2024-11-01', 3, 'M', 'ABEL ZAPATA 166 LAS HERAS', NULL, '2615353717', NULL),
(66, '', '92444018', 'OMAR SEGUNDO', 'TERRAZA ARANCIBIA', '1964-11-18', '2022-10-01', 3, 'M', 'BÂº VILLA AMELIA MZA-B C-6 UGARTECHE LUJAN DE CUYO', NULL, '2615457703', NULL),
(67, '', '11009386', 'OSCAR ANTONIO', 'VARGAS', '1954-07-11', '2023-06-20', 3, 'M', 'ROSENDO SILVA 228 GUTIERREZ MAIPU', NULL, '2612699275', NULL),
(68, '11', '32426847', 'CHRISTIAN MAXIMILIANO', 'VARELA', '1986-08-12', '2022-11-01', 3, 'M', 'PALACIOS 1420 LAS HERAS', NULL, '2617036985', '$2y$10$w3QpuHSVyM6Dmq5HrahDO.AEwxOD9QRVBqpAavgmMuBX8WrleRoZy'),
(69, '71', '17126808', 'Francisco Alejandro', 'Morales', '1965-02-28', '2023-10-01', 3, 'M', 'Sarmiento 1260, Las Heras', NULL, '2617450283', '$2y$10$/RnPKnPERAQorhvGrvUq8OihQtcy81bD5qZ73udYL9t7/vndnY/ga'),
(70, '117', '23210202', 'MARCELO OSVALDO', 'VEGA', '1973-06-30', '2023-04-01', 3, 'M', 'BÂº ANTAGA 3 MZA-O C-12', NULL, '2615508891', '$2y$10$RyKvAwn.Xb1hoYTiejY4u.ADxrGxbWSFO54JWu7CBx711MdSYfpXW'),
(71, '', '17464167', 'FABIAN HUMBERTO', 'VIDELA', '1965-10-01', '2023-08-15', 3, 'M', 'PARAGUAY 2586 CIUDAD 4TA SECCION', NULL, '2616278185', NULL),
(72, '53', '26779975', 'GUILLERMO GERMAN', 'ZABALA', '1979-03-06', '2021-11-25', 3, 'M', 'OLASCOAGA 726 SAN JOSE ', NULL, '2612176606', '$2y$10$ZxhIIVuYQyVM70AFY8aOXO16cB32gBcwSKm7vKUNV9rmclFoYCbA6'),
(73, '45', '31869936', 'CRISTIAN CARLOS ', 'ZAMORA', '1985-12-11', '2020-06-09', 2, 'M', 'BÂº GRAN CAPITAN MZA-22 C-30 LA COLONIA JUNIN', NULL, '2616701539', '$2y$10$IQUDWONVn4YzV9f6XqPz5Obe6rKEq8gt9WAHN70AYBTbnqanBh1KG'),
(74, '', '36999398', 'Edgardo Facundo', 'Morales', '1993-06-20', '1993-06-13', 3, 'M', 'Olascoaga 155, Las Heras', NULL, '2615937299', '$2y$10$m5b.kSB5FLyUK8ybgGKQsuye4NFuUVWFMLNfj.gimHq9.De9JxH32'),
(75, '65', '18343307', 'VICTOR ALEJANDRO', 'PAOLETTI', '1967-07-22', '2018-05-01', 3, 'M', 'SOBREMONTE 679 CIUDAD', NULL, '2613009457', '$2y$10$8uGFVBUHwf5abUtLt.iFVuZzemFIKGfkHUGLbQvPi0pV6j3Qrl/my'),
(76, '101', '24192706', 'HELIANA MARIA ', 'PIZARRO', '1975-10-12', '2021-08-01', 3, 'F', 'BOMBAL 1632 BÂª CEMENTISTA LAS HERAS', NULL, '2615793713', '$2y$10$W39GWr6QWzJ6AE/kiA2wGO9f/Z/3M7V/pjDh5R1PUPayIw4lBfgwG'),
(77, '', '14188845', 'Luis Alberto', 'Mori', '1961-04-25', '2024-02-05', 3, 'M', 'Barrio Las Compuertas MG C15, el Zapallar', NULL, '2617488342', NULL),
(78, '40', '21515827', 'MIGUEL ANGEL', 'PASCOLO', '1969-11-09', '2019-10-01', 2, 'M', 'PASO DE LOS ANDES 560 LAS HERAS', NULL, '2613741933', '$2y$10$Vp2l7LsAb9prITM.67UrO./XjChT7LAN0RLo7dzRjFeeNmF.kBweW'),
(79, '74', '20357306', 'Sergio Manuel ', 'Puebla', '1968-01-06', '2022-08-03', 2, 'M', 'Irigoyen 184, Las Heras', NULL, '2616914648', '$2y$10$pv2yXQEM14I.QZZ.NdnjCuglr2aY.Uwe7R3hY86PNNSEJHlYY.cpG'),
(80, '84', '41112232', 'Agustin Fabrizio', 'RiBeiro', '1998-03-26', '2023-08-01', 2, 'M', 'Barrio Laderas, lote 48. Lujan', NULL, '2613049146', '$2y$10$SOdVLhvjs3j.Be2Rmba4H.bAylH.WnNBTgh/oEMMyfPFl9tfItvte'),
(82, '152', '25924234', 'Gabriel', 'Baradona', '1977-06-26', '2025-09-01', 3, 'M', '9 de julio 166 Las Catitas', NULL, '2634956702', '$2y$10$fEzb6McLb4U24Am3z6fyEO8cE1PCYB34dkBuXYOK9.m8TKarzeK7u'),
(83, '', '44405965', 'Agustin Gabriel', 'Baradona', '2002-09-04', '2025-09-01', 3, 'M', '9 de julio  166 Las Catitas', NULL, '2664213933', '$2y$10$l2HQzX/y8WBEitCu41Pj4evHomKNvPoWHP5KrY1NAhqTxR6YEaSt.'),
(84, '151', '34753665', 'Lucas Matias', 'Lopez', '1989-08-13', '2025-08-14', 3, 'M', 'sarmiento 2421 las heras', NULL, '2617083291', '$2y$10$F.yAzLI8rjW9P38ljQHipuMilNTPF7xgFCKC9XFMuP2yOyqeGSwmW'),
(85, '154', '32665110', 'MIGUEL ', 'ROMEO', '1986-11-03', '2025-10-01', 3, 'M', 'BÂ° VIEJO TONEL II M.D - C. 7', NULL, '2613063082', '$2y$10$F7h49CUap9UyDLZlCAPgGeZpJ/x3M187wgAQQyBbGfk8FaB9Wbjd6'),
(86, '156', '31084447', 'MATIAS DAVID ', 'COSTANTINO', '1984-12-04', '2025-11-01', 3, 'M', 'BÂ° LOS CIRUELO CALLE LA MADRID 3036 LAS HERAS ', NULL, '2615386604', NULL),
(87, '155', '17831297', 'JUAN CARLOS', 'AGUILERA', '1967-04-04', '2025-11-01', 2, 'M', 'SAN FRANCISCO DEL MONTE 3489', NULL, '2616572058', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tpersonasbonos`
--

CREATE TABLE `tpersonasbonos` (
  `id` int NOT NULL,
  `idPersona` int NOT NULL,
  `anio` int NOT NULL,
  `mes` varchar(20) COLLATE utf8mb3_spanish_ci NOT NULL,
  `archivo_url` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `firmado_por` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `firmado_fecha` datetime DEFAULT NULL,
  `firmado_empresa` tinyint(1) DEFAULT '0',
  `firmado_empresa_por` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `firmado_empresa_fecha` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `tpersonasbonos`
--

INSERT INTO `tpersonasbonos` (`id`, `idPersona`, `anio`, `mes`, `archivo_url`, `fecha_creacion`, `firmado_por`, `firmado_fecha`, `firmado_empresa`, `firmado_empresa_por`, `firmado_empresa_fecha`) VALUES
(37, 68, 2025, 'Julio', 'christian_maximiliano_varela_32426847_julio_2025_firmado_1755174442_empresa_1757418500.pdf', '2025-08-14 12:25:12', 'CHRISTIAN MAXIMILIANO VARELA', '2025-08-14 09:27:22', 1, 'Transpol SRL', '2025-09-09 11:48:20'),
(38, 36, 2025, 'Julio', 'maximiliano_alejandro_cardea_34308316_julio_2025_firmado_1755174925_empresa_1757419348.pdf', '2025-08-14 12:33:42', 'Maximiliano Alejandro Cardea', '2025-08-14 09:35:25', 1, 'Transpol SRL', '2025-09-09 12:02:28'),
(39, 16, 2025, 'Julio', 'nelson_javier_alday_26872026_julio_2025_firmado_1755614883_firmado_1755614921_firmado_1755615753_empresa_1757340088.pdf', '2025-08-14 15:31:44', 'Nelson Javier Alday', '2025-08-19 12:02:33', 1, 'Transpol SRL', '2025-09-08 14:01:28'),
(40, 34, 2025, 'Julio', 'sergio_gustavo_carrillo_20887672_julio_2025_firmado_1756247841_empresa_1757419391.pdf', '2025-08-14 15:32:01', 'Sergio Gustavo Carrillo', '2025-08-26 19:37:21', 1, 'Transpol SRL', '2025-09-09 12:03:11'),
(41, 30, 2025, 'Julio', 'carlos_fernandez_17258909_julio_2025_firmado_1755773931_empresa_1757419462_empleado_1757513388.pdf', '2025-08-14 15:32:18', 'CARLOS FERNANDEZ', '2025-09-10 11:09:48', 1, 'Transpol SRL', '2025-09-09 12:04:22'),
(42, 47, 2025, 'Julio', 'walter_osvaldo_giamportone_20626136_julio_2025_firmado_1755226312_empresa_1757419568.pdf', '2025-08-14 15:32:32', 'WALTER OSVALDO GIAMPORTONE', '2025-08-14 23:51:52', 1, 'Transpol SRL', '2025-09-09 12:06:08'),
(43, 52, 2025, 'Julio', 'angel_alberto_gutierrez_16061879_julio_2025_firmado_1755817058_empresa_1757419609_empleado_1763128420.pdf', '2025-08-14 15:32:46', 'ANGEL ALBERTO GUTIERREZ', '2025-11-14 10:53:40', 1, 'Transpol SRL', '2025-09-09 12:06:49'),
(44, 53, 2025, 'Julio', 'raul_roberto_gutierrez_26828602_julio_2025_firmado_1756215275_empresa_1757419619.pdf', '2025-08-14 15:33:00', 'RAUL ROBERTO GUTIERREZ', '2025-08-26 10:34:35', 1, 'Transpol SRL', '2025-09-09 12:06:59'),
(45, 69, 2025, 'Julio', 'francisco_alejandro_morales_17126808_julio_2025_firmado_1755693026_empresa_1757419949_empleado_1757503212_empleado_1758603535_empleado_1760364455_empleado_1760364516.pdf', '2025-08-14 15:33:19', 'Francisco Alejandro Morales', '2025-10-13 11:08:36', 1, 'Transpol SRL', '2025-09-09 12:12:29'),
(46, 75, 2025, 'Julio', 'victor_alejandro_paoletti_18343307_julio_2025_firmado_1755186074_firmado_1755186119_empresa_1757419997.pdf', '2025-08-14 15:33:33', 'VICTOR ALEJANDRO PAOLETTI', '2025-08-14 12:41:59', 1, 'Transpol SRL', '2025-09-09 12:13:17'),
(47, 64, 2025, 'Julio', 'alberto_ceferino_rosales_24207056_julio_2025_firmado_1755601822_empleado_1757089809_empresa_1757420119.pdf', '2025-08-14 15:34:02', 'Alberto Ceferino Rosales', '2025-09-05 13:30:09', 1, 'Transpol SRL', '2025-09-09 12:15:19'),
(48, 72, 2025, 'Julio', 'guillermo_german_zabala_26779975_julio_2025_firmado_1755602940_empresa_1757420148.pdf', '2025-08-14 15:34:19', 'GUILLERMO GERMAN ZABALA', '2025-08-19 08:29:00', 1, 'Transpol SRL', '2025-09-09 12:15:48'),
(49, 76, 2025, 'Julio', 'heliana_maria__pizarro_24192706_julio_2025_firmado_1756216655_empresa_1757420030.pdf', '2025-08-14 15:35:37', 'HELIANA MARIA  PIZARRO', '2025-08-26 10:57:35', 1, 'Transpol SRL', '2025-09-09 12:13:50'),
(50, 23, 2025, 'Julio', 'cristian_facundo_arce_35547205_julio_2025_firmado_1756228619_firmado_1756228635_empresa_1757419257.pdf', '2025-08-14 15:35:48', 'Cristian Facundo Arce', '2025-08-26 14:17:15', 1, 'Transpol SRL', '2025-09-09 12:00:57'),
(51, 25, 2025, 'Julio', 'juan_ignacio__blanco_falasca_39677930_julio_2025_firmado_1755601510_empresa_1757419293.pdf', '2025-08-14 15:35:59', 'Juan Ignacio  Blanco Falasca', '2025-08-19 08:05:10', 1, 'Transpol SRL', '2025-09-09 12:01:33'),
(52, 57, 2025, 'Julio', 'sergio_alberto_martinez_16474497_julio_2025_firmado_1755774563_empresa_1757419937.pdf', '2025-08-14 15:37:34', 'Sergio Alberto Martinez', '2025-08-21 08:09:23', 1, 'Transpol SRL', '2025-09-09 12:12:17'),
(53, 70, 2025, 'Julio', 'marcelo_osvaldo_vega_23210202_julio_2025_firmado_1755606379_empresa_1757420135.pdf', '2025-08-14 15:37:47', 'MARCELO OSVALDO VEGA', '2025-08-19 09:26:19', 1, 'Transpol SRL', '2025-09-09 12:15:35'),
(54, 62, 2025, 'Julio', 'gabriel_maidana__romero_40940426_julio_2025_firmado_1755723616_empresa_1757420103.pdf', '2025-08-14 15:38:01', 'GABRIEL MAIDANA  ROMERO', '2025-08-20 18:00:16', 1, 'Transpol SRL', '2025-09-09 12:15:03'),
(59, 54, 2025, 'Julio', 'jesus_gustavo_jofre_22316397_julio_2025_firmado_1756214941_empresa_1757419634.pdf', '2025-08-18 11:02:52', 'JESUS GUSTAVO JOFRE', '2025-08-26 10:29:01', 1, 'Transpol SRL', '2025-09-09 12:07:14'),
(60, 18, 2025, 'Julio', 'damian_carlos_amaya_27101781_julio_2025_firmado_1755633350_empresa_1757419239.pdf', '2025-08-18 11:03:08', 'Damian Carlos Amaya', '2025-08-19 16:55:50', 1, 'Transpol SRL', '2025-09-09 12:00:39'),
(61, 20, 2025, 'Julio', 'oscar_gaston_atencio_27062238_julio_2025_firmado_1755781565_empresa_1757419272.pdf', '2025-08-18 11:03:17', 'Oscar Gaston Atencio', '2025-08-21 10:06:05', 1, 'Transpol SRL', '2025-09-09 12:01:12'),
(62, 17, 2025, 'Julio', 'leonardo_carmona_20335173_julio_2025_firmado_1755602591_firmado_1755602716_empresa_1757419361_empleado_1758278505.pdf', '2025-08-18 11:03:47', 'Leonardo Carmona', '2025-09-19 07:41:45', 1, 'Transpol SRL', '2025-09-09 12:02:41'),
(63, 42, 2025, 'Julio', 'pablo_roman_garay_34025853_julio_2025_firmado_1755630195_empresa_1757419536.pdf', '2025-08-18 11:04:02', 'PABLO ROMAN GARAY', '2025-08-19 16:03:15', 1, 'Transpol SRL', '2025-09-09 12:05:36'),
(64, 39, 2025, 'Julio', 'humberto_francisco_lacroux_23389257_julio_2025_firmado_1755723866_empresa_1757419650.pdf', '2025-08-18 11:04:24', 'Humberto Francisco Lacroux', '2025-08-20 18:04:26', 1, 'Transpol SRL', '2025-09-09 12:07:30'),
(85, 48, 2025, 'Julio', 'jose_fernando_gonzalez_26595153_julio_2025_firmado_1755642953_empresa_1757336150.pdf', '2025-08-18 14:53:59', 'JOSE FERNANDO GONZALEZ', '2025-08-19 19:35:53', 1, 'Transpol SRL', '2025-09-08 12:55:50'),
(86, 27, 2025, 'Julio', 'carolina_elizabeth_brizuela_28225605_julio_2025_firmado_1756256815_empresa_1757419310.pdf', '2025-08-18 14:56:00', 'Carolina Elizabeth Brizuela', '2025-08-26 22:06:55', 1, 'Map SAS', '2025-09-09 12:01:50'),
(87, 29, 2025, 'Julio', 'cristian_agustin_canto_41338880_julio_2025_firmado_1755773958_empresa_1757419329.pdf', '2025-08-18 14:56:18', 'Cristian Agustin Canto', '2025-08-21 07:59:18', 1, 'Transpol SRL', '2025-09-09 12:02:09'),
(88, 22, 2025, 'Julio', 'leonardo_coria_31266909_julio_2025_firmado_1755603192_empresa_1757419410.pdf', '2025-08-18 14:56:34', 'LEONARDO CORIA', '2025-08-19 08:33:12', 1, 'Transpol SRL', '2025-09-09 12:03:30'),
(89, 43, 2025, 'Julio', 'alexis_joel__lozano_esposito_38207021_julio_2025_firmado_1755778976_empleado_1757125016_empresa_1757419674.pdf', '2025-08-18 14:56:48', 'Alexis Joel  Lozano Esposito', '2025-09-05 23:16:56', 1, 'Map SAS', '2025-09-09 12:07:54'),
(90, 44, 2025, 'Julio', 'hector_eduardo_lujan_24058172_julio_2025_firmado_1755813393_firmado_1755813539_empleado_1756497256_empleado_1756497273_empleado_1757209380_empleado_1757209391_empresa_1757419699.pdf', '2025-08-18 14:57:03', 'Hector Eduardo Lujan', '2025-09-06 22:43:11', 1, 'Transpol SRL', '2025-09-09 12:08:19'),
(91, 26, 2025, 'Julio', 'gabriel__cornejo_23240245_julio_2025_firmado_1755696044_empresa_1757419427.pdf', '2025-08-18 14:57:17', 'GABRIEL  CORNEJO', '2025-08-20 10:20:44', 1, 'Transpol SRL', '2025-09-09 12:03:47'),
(92, 28, 2025, 'Julio', 'alexis_espina_molina_35879403_julio_2025_firmado_1755601532_empresa_1757419441.pdf', '2025-08-18 14:57:30', 'ALEXIS ESPINA MOLINA', '2025-08-19 08:05:32', 1, 'Map SAS', '2025-09-09 12:04:01'),
(93, 32, 2025, 'Julio', 'jonathan_fernandez_32909739_julio_2025_firmado_1755780134_empresa_1757419475.pdf', '2025-08-18 14:57:48', 'JONATHAN FERNANDEZ', '2025-08-21 09:42:14', 1, 'Transpol SRL', '2025-09-09 12:04:35'),
(94, 37, 2025, 'Julio', 'enzo_ezequiel__fernandez_orrego_39377396_julio_2025_firmado_1755608637_empresa_1757419493.pdf', '2025-08-18 14:58:11', 'ENZO EZEQUIEL  FERNANDEZ ORREGO', '2025-08-19 10:03:57', 1, 'Map SAS', '2025-09-09 12:04:53'),
(95, 74, 2025, 'Julio', 'edgardo_facundo_morales_36999398_julio_2025_firmado_1756213589_empresa_1757419959.pdf', '2025-08-18 14:58:28', 'Edgardo Facundo Morales', '2025-08-26 10:06:29', 1, 'Transpol SRL', '2025-09-09 12:12:39'),
(96, 73, 2025, 'Julio', 'cristian_carlos__zamora_31869936_julio_2025_firmado_1755601488_empresa_1757420163.pdf', '2025-08-18 14:58:43', 'CRISTIAN CARLOS  ZAMORA', '2025-08-19 08:04:48', 1, 'Map SAS', '2025-09-09 12:16:03'),
(97, 79, 2025, 'Julio', 'sergio_manuel__puebla_20357306_julio_2025_firmado_1756214540_empresa_1757420055.pdf', '2025-08-18 14:58:56', 'Sergio Manuel  Puebla', '2025-08-26 10:22:20', 1, 'Map SAS', '2025-09-09 12:14:15'),
(98, 78, 2025, 'Julio', 'miguel_angel_pascolo_21515827_julio_2025_firmado_1755907592_empresa_1757420011.pdf', '2025-08-18 14:59:13', 'MIGUEL ANGEL PASCOLO', '2025-08-22 21:06:32', 1, 'Map SAS', '2025-09-09 12:13:31'),
(99, 61, 2025, 'Julio', 'pablo_emanuel_moyano_30571009_julio_2025_firmado_1755700770_empresa_1757419972.pdf', '2025-08-18 14:59:29', 'Pablo Emanuel Moyano', '2025-08-20 11:39:30', 1, 'Transpol SRL', '2025-09-09 12:12:52'),
(100, 55, 2025, 'Julio', 'daniel_fernando_nievas_36134788_julio_2025_firmado_1756309780_empresa_1757419987.pdf', '2025-08-18 14:59:41', 'DANIEL FERNANDO NIEVAS', '2025-08-27 12:49:40', 1, 'Transpol SRL', '2025-09-09 12:13:07'),
(101, 33, 2025, 'Julio', 'ezequiel_eduardo_fernandez_rufino_33053563_julio_2025_firmado_1755721960_empresa_1757419509.pdf', '2025-08-18 14:59:54', 'EZEQUIEL EDUARDO FERNANDEZ RUFINO', '2025-08-20 17:32:40', 1, 'Map SAS', '2025-09-09 12:05:09'),
(102, 45, 2025, 'Julio', 'ciro_carlos_daniel_ghilardi_33517935_julio_2025_firmado_1755873447_empresa_1757419549.pdf', '2025-08-18 15:00:07', 'Ciro Carlos Daniel Ghilardi', '2025-08-22 11:37:27', 1, 'Map SAS', '2025-09-09 12:05:49'),
(103, 49, 2025, 'Julio', 'ariel_hugo_gomez_41885399_julio_2025_firmado_1755601730_empresa_1757419582_empleado_1763129407.pdf', '2025-08-18 15:00:20', 'ARIEL HUGO GOMEZ', '2025-11-14 11:10:07', 1, 'Map SAS', '2025-09-09 12:06:22'),
(104, 41, 2025, 'Julio', 'natalio_matias_lopez_34753664_julio_2025_firmado_1756295914_empresa_1757419664.pdf', '2025-08-18 15:00:33', 'Natalio Matias Lopez', '2025-08-27 08:58:34', 1, 'Transpol SRL', '2025-09-09 12:07:44'),
(105, 40, 2025, 'Julio', 'ignacio_sebastian_flores_44746306_julio_2025_firmado_1755897841_empresa_1757419523.pdf', '2025-08-18 15:01:07', 'IGNACIO SEBASTIAN FLORES', '2025-08-22 18:24:01', 1, 'Map SAS', '2025-09-09 12:05:23'),
(106, 46, 2025, 'Julio', 'osvaldo_raul_martinez_17744953_julio_2025_firmado_1756221187_empleado_1757079957_empresa_1757419925.pdf', '2025-08-18 15:01:44', 'Osvaldo Raul Martinez', '2025-09-05 10:45:57', 1, 'Transpol SRL', '2025-09-09 12:12:05'),
(107, 58, 2025, 'Julio', 'gabriel_antonio_repetto_24225490_julio_2025_firmado_1756216237_empresa_1757420067.pdf', '2025-08-18 15:02:40', 'GABRIEL ANTONIO REPETTO', '2025-08-26 10:50:37', 1, 'Transpol SRL', '2025-09-09 12:14:27'),
(108, 80, 2025, 'Julio', 'agustin_fabrizio_ribeiro_41112232_julio_2025_firmado_1755608375_empresa_1757420085.pdf', '2025-08-18 15:02:49', 'Agustin Fabrizio RiBeiro', '2025-08-19 09:59:35', 1, 'Map SAS', '2025-09-09 12:14:45'),
(117, 14, 2025, 'Julio', 'ana_gabriela_pollicino_30108238_julio_2025_empresa_1756382526_empleado_1756382544.pdf', '2025-08-28 12:02:03', 'Ana Gabriela Pollicino', '2025-08-28 09:02:24', 1, 'Map SAS', '2025-08-28 12:02:06'),
(119, 16, 2025, 'Agosto', 'nelson_javier_alday_26872026_agosto_2025_empresa_1757419228_empleado_1757512520.pdf', '2025-09-09 12:00:25', 'Nelson Javier Alday', '2025-09-10 10:55:20', 1, 'Transpol SRL', '2025-09-09 12:00:28'),
(130, 68, 2025, 'Agosto', 'christian_maximiliano_varela_32426847_agosto_2025_empresa_1757419214_empleado_1757421299.pdf', '2025-09-09 12:00:12', 'CHRISTIAN MAXIMILIANO VARELA', '2025-09-09 09:34:59', 1, 'Transpol SRL', '2025-09-09 12:00:14'),
(131, 18, 2025, 'Agosto', 'damian_carlos_amaya_27101781_agosto_2025_empresa_1757419242_empleado_1757447090.pdf', '2025-09-09 12:00:36', 'Damian Carlos Amaya', '2025-09-09 16:44:50', 1, 'Transpol SRL', '2025-09-09 12:00:42'),
(132, 23, 2025, 'Agosto', 'cristian_facundo_arce_35547205_agosto_2025_empresa_1757419261_empleado_1757455011.pdf', '2025-09-09 12:00:54', 'Cristian Facundo Arce', '2025-09-09 18:56:51', 1, 'Transpol SRL', '2025-09-09 12:01:01'),
(133, 20, 2025, 'Agosto', 'oscar_gaston_atencio_27062238_agosto_2025_empresa_1757419279_empleado_1757937671.pdf', '2025-09-09 12:01:09', 'Oscar Gaston Atencio', '2025-09-15 09:01:11', 1, 'Transpol SRL', '2025-09-09 12:01:19'),
(134, 25, 2025, 'Agosto', 'juan_ignacio__blanco_falasca_39677930_agosto_2025_empresa_1757419296_empleado_1757422800.pdf', '2025-09-09 12:01:30', 'Juan Ignacio  Blanco Falasca', '2025-09-09 10:00:00', 1, 'Transpol SRL', '2025-09-09 12:01:36'),
(135, 27, 2025, 'Agosto', 'carolina_elizabeth_brizuela_28225605_agosto_2025_empresa_1757419308_empleado_1757937434.pdf', '2025-09-09 12:01:46', 'Carolina Elizabeth Brizuela', '2025-09-15 08:57:14', 1, 'Map SAS', '2025-09-09 12:01:48'),
(136, 29, 2025, 'Agosto', 'cristian_agustin_canto_41338880_agosto_2025_empresa_1757419328_empleado_1758036339.pdf', '2025-09-09 12:02:02', 'Cristian Agustin Canto', '2025-09-16 12:25:39', 1, 'Transpol SRL', '2025-09-09 12:02:08'),
(137, 36, 2025, 'Agosto', 'maximiliano_alejandro_cardea_34308316_agosto_2025_empresa_1757419346_empleado_1757420172.pdf', '2025-09-09 12:02:24', 'Maximiliano Alejandro Cardea', '2025-09-09 09:16:12', 1, 'Transpol SRL', '2025-09-09 12:02:26'),
(138, 17, 2025, 'Agosto', 'leonardo_carmona_20335173_agosto_2025_empresa_1757419359_empleado_1757941206.pdf', '2025-09-09 12:02:37', 'Leonardo Carmona', '2025-09-15 10:00:06', 1, 'Transpol SRL', '2025-09-09 12:02:39'),
(139, 34, 2025, 'Agosto', 'sergio_gustavo_carrillo_20887672_agosto_2025_empresa_1757419389_empleado_1757550217.pdf', '2025-09-09 12:03:06', 'Sergio Gustavo Carrillo', '2025-09-10 21:23:37', 1, 'Transpol SRL', '2025-09-09 12:03:09'),
(140, 22, 2025, 'Agosto', 'leonardo_coria_31266909_agosto_2025_empresa_1757419411.pdf', '2025-09-09 12:03:27', NULL, NULL, 1, 'Transpol SRL', '2025-09-09 12:03:31'),
(141, 26, 2025, 'Agosto', 'gabriel__cornejo_23240245_agosto_2025_empresa_1757419425_empleado_1757937879.pdf', '2025-09-09 12:03:42', 'GABRIEL  CORNEJO', '2025-09-15 09:04:39', 1, 'Transpol SRL', '2025-09-09 12:03:45'),
(142, 28, 2025, 'Agosto', 'alexis_espina_molina_35879403_agosto_2025_empresa_1757419439_empleado_1757425971.pdf', '2025-09-09 12:03:57', 'ALEXIS ESPINA MOLINA', '2025-09-09 10:52:51', 1, 'Map SAS', '2025-09-09 12:03:59'),
(143, 30, 2025, 'Agosto', 'carlos_fernandez_17258909_agosto_2025_empresa_1757419461_empleado_1757621017.pdf', '2025-09-09 12:04:19', 'CARLOS FERNANDEZ', '2025-09-11 17:03:37', 1, 'Transpol SRL', '2025-09-09 12:04:21'),
(144, 32, 2025, 'Agosto', 'jonathan_fernandez_32909739_agosto_2025_empresa_1757419473_empleado_1757420855.pdf', '2025-09-09 12:04:31', 'JONATHAN FERNANDEZ', '2025-09-09 09:27:35', 1, 'Transpol SRL', '2025-09-09 12:04:33'),
(145, 37, 2025, 'Agosto', 'enzo_ezequiel__fernandez_orrego_39377396_agosto_2025_empresa_1757419491_empleado_1757687530.pdf', '2025-09-09 12:04:49', 'ENZO EZEQUIEL  FERNANDEZ ORREGO', '2025-09-12 11:32:10', 1, 'Map SAS', '2025-09-09 12:04:51'),
(146, 33, 2025, 'Agosto', 'ezequiel_eduardo_fernandez_rufino_33053563_agosto_2025_empresa_1757419507_empleado_1758031932.pdf', '2025-09-09 12:05:05', 'EZEQUIEL EDUARDO FERNANDEZ RUFINO', '2025-09-16 11:12:12', 1, 'Map SAS', '2025-09-09 12:05:07'),
(147, 40, 2025, 'Agosto', 'ignacio_sebastian_flores_44746306_agosto_2025_empresa_1757419521_empleado_1757438552.pdf', '2025-09-09 12:05:19', 'IGNACIO SEBASTIAN FLORES', '2025-09-09 14:22:32', 1, 'Map SAS', '2025-09-09 12:05:21'),
(148, 42, 2025, 'Agosto', 'pablo_roman_garay_34025853_agosto_2025_empresa_1757419535_empleado_1758040173.pdf', '2025-09-09 12:05:32', 'PABLO ROMAN GARAY', '2025-09-16 13:29:33', 1, 'Transpol SRL', '2025-09-09 12:05:35'),
(149, 45, 2025, 'Agosto', 'ciro_carlos_daniel_ghilardi_33517935_agosto_2025_empresa_1757419547_empleado_1757420366.pdf', '2025-09-09 12:05:45', 'Ciro Carlos Daniel Ghilardi', '2025-09-09 09:19:26', 1, 'Map SAS', '2025-09-09 12:05:47'),
(150, 47, 2025, 'Agosto', 'walter_osvaldo_giamportone_20626136_agosto_2025_empresa_1757419566_empleado_1757444633.pdf', '2025-09-09 12:06:03', 'WALTER OSVALDO GIAMPORTONE', '2025-09-09 16:03:53', 1, 'Transpol SRL', '2025-09-09 12:06:06'),
(151, 49, 2025, 'Agosto', 'ariel_hugo_gomez_41885399_agosto_2025_empresa_1757419580_empleado_1757422594.pdf', '2025-09-09 12:06:17', 'ARIEL HUGO GOMEZ', '2025-09-09 09:56:34', 1, 'Map SAS', '2025-09-09 12:06:20'),
(152, 48, 2025, 'Agosto', 'jose_fernando_gonzalez_26595183_agosto_2025_empresa_1757419594_empleado_1757444975.pdf', '2025-09-09 12:06:32', 'JOSE FERNANDO GONZALEZ', '2025-09-09 16:09:35', 1, 'Transpol SRL', '2025-09-09 12:06:34'),
(153, 52, 2025, 'Agosto', 'angel_alberto_gutierrez_16061879_agosto_2025_empresa_1757419607_empleado_1757427596.pdf', '2025-09-09 12:06:44', 'ANGEL ALBERTO GUTIERREZ', '2025-09-09 11:19:56', 1, 'Transpol SRL', '2025-09-09 12:06:47'),
(154, 53, 2025, 'Agosto', 'raul_roberto_gutierrez_26828602_agosto_2025_empresa_1757419621_empleado_1757621228_empleado_1757621274.pdf', '2025-09-09 12:06:56', 'RAUL ROBERTO GUTIERREZ', '2025-09-11 17:07:54', 1, 'Transpol SRL', '2025-09-09 12:07:01'),
(155, 54, 2025, 'Agosto', 'jesus_gustavo_jofre_22316397_agosto_2025_empresa_1757419632_empleado_1758031749.pdf', '2025-09-09 12:07:10', 'JESUS GUSTAVO JOFRE', '2025-09-16 11:09:09', 1, 'Transpol SRL', '2025-09-09 12:07:12'),
(156, 39, 2025, 'Agosto', 'humberto_francisco_lacroux_23389257_agosto_2025_empresa_1757419648_empleado_1757426089.pdf', '2025-09-09 12:07:26', 'Humberto Francisco Lacroux', '2025-09-09 10:54:49', 1, 'Transpol SRL', '2025-09-09 12:07:28'),
(157, 41, 2025, 'Agosto', 'natalio_matias_lopez_34753664_agosto_2025_empresa_1757419662_empleado_1758031896.pdf', '2025-09-09 12:07:40', 'Natalio Matias Lopez', '2025-09-16 11:11:36', 1, 'Transpol SRL', '2025-09-09 12:07:42'),
(158, 43, 2025, 'Agosto', 'alexis_joel__lozano_esposito_38207021_agosto_2025_empresa_1757419684_empleado_1757445302_empleado_1757445336.pdf', '2025-09-09 12:08:02', 'Alexis Joel  Lozano Esposito', '2025-09-09 16:15:36', 1, 'Map SAS', '2025-09-09 12:08:04'),
(159, 44, 2025, 'Agosto', 'hector_eduardo_lujan_24058172_agosto_2025_empresa_1757419696_empleado_1757462713.pdf', '2025-09-09 12:08:14', 'Hector Eduardo Lujan', '2025-09-09 21:05:13', 1, 'Transpol SRL', '2025-09-09 12:08:16'),
(160, 50, 2025, 'Agosto', 'sebastian_alejandro_manzo_29787821_agosto_2025_empresa_1757419712_empleado_1757420023.pdf', '2025-09-09 12:08:29', 'Sebastian Alejandro Manzo', '2025-09-09 09:13:43', 1, 'Transpol SRL', '2025-09-09 12:08:32'),
(161, 46, 2025, 'Agosto', 'osvaldo_raul_martinez_17744953_agosto_2025_empresa_1757419923_empleado_1757420479.pdf', '2025-09-09 12:11:57', 'Osvaldo Raul Martinez', '2025-09-09 09:21:19', 1, 'Transpol SRL', '2025-09-09 12:12:03'),
(162, 57, 2025, 'Agosto', 'sergio_alberto_martinez_16474497_agosto_2025_empresa_1757419935_empleado_1757424429.pdf', '2025-09-09 12:12:12', 'Sergio Alberto Martinez', '2025-09-09 10:27:09', 1, 'Transpol SRL', '2025-09-09 12:12:15'),
(163, 69, 2025, 'Agosto', 'francisco_alejandro_morales_17126808_agosto_2025_empresa_1757419948_empleado_1757507020.pdf', '2025-09-09 12:12:25', 'Francisco Alejandro Morales', '2025-09-10 09:23:40', 1, 'Transpol SRL', '2025-09-09 12:12:28'),
(164, 74, 2025, 'Agosto', 'edgardo_facundo_morales_36999398_agosto_2025_empresa_1757419958_empleado_1757433602.pdf', '2025-09-09 12:12:36', 'Edgardo Facundo Morales', '2025-09-09 13:00:02', 1, 'Transpol SRL', '2025-09-09 12:12:38'),
(165, 61, 2025, 'Agosto', 'pablo_emanuel_moyano_30571009_agosto_2025_empresa_1757419971_empleado_1757552193.pdf', '2025-09-09 12:12:49', 'Pablo Emanuel Moyano', '2025-09-10 21:56:33', 1, 'Transpol SRL', '2025-09-09 12:12:51'),
(166, 55, 2025, 'Agosto', 'daniel_fernando_nievas_36134788_agosto_2025_empresa_1757419985_empleado_1757934705.pdf', '2025-09-09 12:13:03', 'Daniel Fernando Nievas', '2025-09-15 08:11:45', 1, 'Transpol SRL', '2025-09-09 12:13:05'),
(167, 75, 2025, 'Agosto', 'victor_alejandro_paoletti_18343307_agosto_2025_empresa_1757419995_empleado_1757507401.pdf', '2025-09-09 12:13:14', 'VICTOR ALEJANDRO PAOLETTI', '2025-09-10 09:30:01', 1, 'Transpol SRL', '2025-09-09 12:13:15'),
(168, 78, 2025, 'Agosto', 'miguel_angel_pascolo_21515827_agosto_2025_empresa_1757420009_empleado_1760450726.pdf', '2025-09-09 12:13:28', 'MIGUEL ANGEL PASCOLO', '2025-10-14 11:05:26', 1, 'Map SAS', '2025-09-09 12:13:29'),
(169, 76, 2025, 'Agosto', 'heliana_maria__pizarro_24192706_agosto_2025_empresa_1757420028_empleado_1757461688.pdf', '2025-09-09 12:13:47', 'HELIANA MARIA  PIZARRO', '2025-09-09 20:48:08', 1, 'Transpol SRL', '2025-09-09 12:13:48'),
(170, 14, 2025, 'Agosto', 'ana_gabriela_pollicino_30108238_agosto_2025_empresa_1757420042_empleado_1757420369.pdf', '2025-09-09 12:14:00', 'Ana Gabriela Pollicino', '2025-09-09 09:19:29', 1, 'Transpol SRL', '2025-09-09 12:14:02'),
(171, 79, 2025, 'Agosto', 'sergio_manuel__puebla_20357306_agosto_2025_empresa_1757420053_empleado_1757422739.pdf', '2025-09-09 12:14:11', 'Sergio Manuel  Puebla', '2025-09-09 09:58:59', 1, 'Map SAS', '2025-09-09 12:14:13'),
(172, 58, 2025, 'Agosto', 'gabriel_antonio_repetto_24225490_agosto_2025_empresa_1757420065_empleado_1757427929.pdf', '2025-09-09 12:14:24', 'GABRIEL ANTONIO REPETTO', '2025-09-09 11:25:29', 1, 'Transpol SRL', '2025-09-09 12:14:25'),
(173, 80, 2025, 'Agosto', 'agustin_fabrizio_ribeiro_41112232_agosto_2025_empresa_1757420084_empleado_1757424322.pdf', '2025-09-09 12:14:41', 'Agustin Fabrizio RiBeiro', '2025-09-09 10:25:22', 1, 'Map SAS', '2025-09-09 12:14:44'),
(174, 62, 2025, 'Agosto', 'gabriel_maidana__romero_40940426_agosto_2025_empresa_1757420101_empleado_1757440911.pdf', '2025-09-09 12:14:58', 'GABRIEL MAIDANA  ROMERO', '2025-09-09 15:01:51', 1, 'Transpol SRL', '2025-09-09 12:15:01'),
(175, 64, 2025, 'Agosto', 'alberto_ceferino_rosales_24207056_agosto_2025_empresa_1757420117_empleado_1757420514.pdf', '2025-09-09 12:15:14', 'Alberto Ceferino Rosales', '2025-09-09 09:21:54', 1, 'Transpol SRL', '2025-09-09 12:15:17'),
(176, 70, 2025, 'Agosto', 'marcelo_osvaldo_vega_23210202_agosto_2025_empresa_1757420133_empleado_1757420471.pdf', '2025-09-09 12:15:31', 'MARCELO OSVALDO VEGA', '2025-09-09 09:21:11', 1, 'Transpol SRL', '2025-09-09 12:15:33'),
(177, 72, 2025, 'Agosto', 'guillermo_german_zabala_26779975_agosto_2025_empresa_1757420146_empleado_1757420508_empleado_1757420535.pdf', '2025-09-09 12:15:43', 'GUILLERMO GERMAN ZABALA', '2025-09-09 09:22:15', 1, 'Transpol SRL', '2025-09-09 12:15:46'),
(178, 73, 2025, 'Agosto', 'cristian_carlos__zamora_31869936_agosto_2025_empresa_1757420161_empleado_1757934682.pdf', '2025-09-09 12:15:57', 'CRISTIAN CARLOS  ZAMORA', '2025-09-15 08:11:22', 1, 'Map SAS', '2025-09-09 12:16:01'),
(179, 84, 2025, 'Agosto', 'lucas_matias_lopez_34753665_agosto_2025_empresa_1757933576_empleado_1758032226.pdf', '2025-09-15 10:52:52', 'Lucas Matias Lopez', '2025-09-16 11:17:06', 1, 'Transpol SRL', '2025-09-15 10:52:56'),
(180, 16, 2025, 'Septiembre', 'nelson_javier_alday_26872026_septiembre_2025_empresa_1759838565_empleado_1760367648.pdf', '2025-10-07 12:02:39', 'Nelson Javier Alday', '2025-10-13 12:00:48', 1, 'Transpol SRL', '2025-10-07 12:02:45'),
(181, 18, 2025, 'Septiembre', 'damian_carlos_amaya_27101781_septiembre_2025_empresa_1759838576_empleado_1760373011.pdf', '2025-10-07 12:02:53', 'Damian Carlos Amaya', '2025-10-13 13:30:11', 1, 'Transpol SRL', '2025-10-07 12:02:56'),
(182, 23, 2025, 'Septiembre', 'cristian_facundo_arce_35547205_septiembre_2025_empresa_1759838590_empleado_1760361992.pdf', '2025-10-07 12:03:07', 'Cristian Facundo Arce', '2025-10-13 10:26:32', 1, 'Transpol SRL', '2025-10-07 12:03:10'),
(183, 20, 2025, 'Septiembre', 'oscar_gaston_atencio_27062238_septiembre_2025_empresa_1759838609_empleado_1759924279.pdf', '2025-10-07 12:03:26', 'Oscar Gaston Atencio', '2025-10-08 08:51:19', 1, 'Transpol SRL', '2025-10-07 12:03:29'),
(184, 82, 2025, 'Septiembre', 'gabriel_baradona_25924234_septiembre_2025_empresa_1759838622_empleado_1760364642.pdf', '2025-10-07 12:03:40', 'Gabriel Baradona', '2025-10-13 11:10:42', 1, 'Transpol SRL', '2025-10-07 12:03:42'),
(185, 25, 2025, 'Septiembre', 'juan_ignacio__blanco_falasca_39677930_septiembre_2025_empresa_1759838632_empleado_1759882438.pdf', '2025-10-07 12:03:50', 'Juan Ignacio  Blanco Falasca', '2025-10-07 21:13:58', 1, 'Transpol SRL', '2025-10-07 12:03:52'),
(186, 27, 2025, 'Septiembre', 'carolina_elizabeth_brizuela_28225605_septiembre_2025_empresa_1759838644_empleado_1760444901.pdf', '2025-10-07 12:04:01', 'Carolina Elizabeth Brizuela', '2025-10-14 09:28:21', 1, 'Map SAS', '2025-10-07 12:04:04'),
(187, 29, 2025, 'Septiembre', 'cristian_agustin_canto_41338880_septiembre_2025_empresa_1759838655_empleado_1759956307.pdf', '2025-10-07 12:04:13', 'Cristian Agustin Canto', '2025-10-08 17:45:07', 1, 'Transpol SRL', '2025-10-07 12:04:15'),
(188, 36, 2025, 'Septiembre', 'maximiliano_alejandro_cardea_34308316_septiembre_2025_empresa_1759838667_empleado_1759842221.pdf', '2025-10-07 12:04:25', 'Maximiliano Alejandro Cardea', '2025-10-07 10:03:41', 1, 'Transpol SRL', '2025-10-07 12:04:27'),
(189, 17, 2025, 'Septiembre', 'leonardo_carmona_20335173_septiembre_2025_empresa_1759838677_empleado_1760364892.pdf', '2025-10-07 12:04:35', 'Leonardo Carmona', '2025-10-13 11:14:52', 1, 'Transpol SRL', '2025-10-07 12:04:37'),
(190, 34, 2025, 'Septiembre', 'sergio_gustavo_carrillo_20887672_septiembre_2025_empresa_1759838688_empleado_1760225255.pdf', '2025-10-07 12:04:46', 'Sergio Gustavo Carrillo', '2025-10-11 20:27:35', 1, 'Transpol SRL', '2025-10-07 12:04:48'),
(191, 26, 2025, 'Septiembre', 'gabriel__cornejo_23240245_septiembre_2025_empresa_1759838708_empleado_1760218898.pdf', '2025-10-07 12:05:05', 'GABRIEL  CORNEJO', '2025-10-11 18:41:38', 1, 'Transpol SRL', '2025-10-07 12:05:08'),
(192, 28, 2025, 'Septiembre', 'alexis_espina_molina_35879403_septiembre_2025_empresa_1759838719_empleado_1760387158.pdf', '2025-10-07 12:05:16', 'ALEXIS ESPINA MOLINA', '2025-10-13 17:25:58', 1, 'Map SAS', '2025-10-07 12:05:19'),
(193, 30, 2025, 'Septiembre', 'carlos_fernandez_17258909_septiembre_2025_empresa_1759838729_empleado_1760362351.pdf', '2025-10-07 12:05:26', 'CARLOS FERNANDEZ', '2025-10-13 10:32:31', 1, 'Transpol SRL', '2025-10-07 12:05:29'),
(194, 32, 2025, 'Septiembre', 'jonathan_fernandez_32909739_septiembre_2025_empresa_1759838740_empleado_1760193379.pdf', '2025-10-07 12:05:37', 'JONATHAN FERNANDEZ', '2025-10-11 11:36:19', 1, 'Transpol SRL', '2025-10-07 12:05:40'),
(195, 37, 2025, 'Septiembre', 'enzo_ezequiel__fernandez_orrego_39377396_septiembre_2025_empresa_1759838750_empleado_1760356844.pdf', '2025-10-07 12:05:47', 'ENZO EZEQUIEL  FERNANDEZ ORREGO', '2025-10-13 09:00:44', 1, 'Map SAS', '2025-10-07 12:05:50'),
(196, 33, 2025, 'Septiembre', 'ezequiel_eduardo_fernandez_rufino_33053563_septiembre_2025_empresa_1759838761_empleado_1759848384_empleado_1761568689.pdf', '2025-10-07 12:05:58', 'EZEQUIEL EDUARDO FERNANDEZ RUFINO', '2025-10-27 09:38:09', 1, 'Map SAS', '2025-10-07 12:06:01'),
(197, 40, 2025, 'Septiembre', 'ignacio_sebastian_flores_44746306_septiembre_2025_empresa_1759838771_empleado_1760362030.pdf', '2025-10-07 12:06:09', 'IGNACIO SEBASTIAN FLORES', '2025-10-13 10:27:10', 1, 'Map SAS', '2025-10-07 12:06:11'),
(198, 42, 2025, 'Septiembre', 'pablo_roman_garay_34025853_septiembre_2025_empresa_1759838781_empleado_1760402714.pdf', '2025-10-07 12:06:19', 'PABLO ROMAN GARAY', '2025-10-13 21:45:14', 1, 'Transpol SRL', '2025-10-07 12:06:21'),
(199, 45, 2025, 'Septiembre', 'ciro_carlos_daniel_ghilardi_33517935_septiembre_2025_empresa_1759838791_empleado_1760179925.pdf', '2025-10-07 12:06:28', 'Ciro Carlos Daniel Ghilardi', '2025-10-11 07:52:05', 1, 'Map SAS', '2025-10-07 12:06:31'),
(200, 47, 2025, 'Septiembre', 'walter_osvaldo_giamportone_20626136_septiembre_2025_empresa_1759838800_empleado_1759933297_empleado_1762604960.pdf', '2025-10-07 12:06:37', 'WALTER OSVALDO GIAMPORTONE', '2025-11-08 09:29:20', 1, 'Transpol SRL', '2025-10-07 12:06:40'),
(201, 49, 2025, 'Septiembre', 'ariel_hugo_gomez_41885399_septiembre_2025_empresa_1759838811_empleado_1759910539.pdf', '2025-10-07 12:06:48', 'ARIEL HUGO GOMEZ', '2025-10-08 05:02:19', 1, 'Map SAS', '2025-10-07 12:06:51'),
(202, 48, 2025, 'Septiembre', 'jose_fernando_gonzalez_26595183_septiembre_2025_empresa_1759838827_empleado_1760363505.pdf', '2025-10-07 12:07:04', 'JOSE FERNANDO GONZALEZ', '2025-10-13 10:51:45', 1, 'Transpol SRL', '2025-10-07 12:07:07'),
(203, 52, 2025, 'Septiembre', 'angel_alberto_gutierrez_16061879_septiembre_2025_empresa_1759838836_empleado_1760362242.pdf', '2025-10-07 12:07:14', 'ANGEL ALBERTO GUTIERREZ', '2025-10-13 10:30:42', 1, 'Transpol SRL', '2025-10-07 12:07:16'),
(204, 53, 2025, 'Septiembre', 'raul_roberto_gutierrez_26828602_septiembre_2025_empresa_1759838847_empleado_1759924191_empleado_1760362363.pdf', '2025-10-07 12:07:24', 'RAUL ROBERTO GUTIERREZ', '2025-10-13 10:32:43', 1, 'Transpol SRL', '2025-10-07 12:07:27'),
(205, 54, 2025, 'Septiembre', 'jesus_gustavo_jofre_22316397_septiembre_2025_empresa_1759838859_empleado_1761056519.pdf', '2025-10-07 12:07:36', 'JESUS GUSTAVO JOFRE', '2025-10-21 11:21:59', 1, 'Transpol SRL', '2025-10-07 12:07:39'),
(206, 39, 2025, 'Septiembre', 'humberto_francisco_lacroux_23389257_septiembre_2025_empresa_1759838924_empleado_1760317555.pdf', '2025-10-07 12:08:42', 'Humberto Francisco Lacroux', '2025-10-12 22:05:55', 1, 'Transpol SRL', '2025-10-07 12:08:44'),
(207, 41, 2025, 'Septiembre', 'natalio_matias_lopez_34753664_septiembre_2025_empresa_1759838935_empleado_1760373417.pdf', '2025-10-07 12:08:52', 'Natalio Matias Lopez', '2025-10-13 13:36:57', 1, 'Transpol SRL', '2025-10-07 12:08:55'),
(208, 84, 2025, 'Septiembre', 'lucas_matias_lopez_34753665_septiembre_2025_empresa_1759838949_empleado_1760296923.pdf', '2025-10-07 12:09:06', 'Lucas Matias Lopez', '2025-10-12 16:22:03', 1, 'Transpol SRL', '2025-10-07 12:09:09'),
(209, 43, 2025, 'Septiembre', 'alexis_joel__lozano_esposito_38207021_septiembre_2025_empresa_1759838960_empleado_1760364963.pdf', '2025-10-07 12:09:16', 'Alexis Joel  Lozano Esposito', '2025-10-13 11:16:03', 1, 'Map SAS', '2025-10-07 12:09:20'),
(210, 44, 2025, 'Septiembre', 'hector_eduardo_lujan_24058172_septiembre_2025_empresa_1759838969_empleado_1759865754.pdf', '2025-10-07 12:09:27', 'Hector Eduardo Lujan', '2025-10-07 16:35:54', 1, 'Transpol SRL', '2025-10-07 12:09:29'),
(211, 50, 2025, 'Septiembre', 'sebastian_alejandro_manzo_29787821_septiembre_2025_empresa_1759838979_empleado_1760444671.pdf', '2025-10-07 12:09:36', 'Sebastian Alejandro Manzo', '2025-10-14 09:24:31', 1, 'Transpol SRL', '2025-10-07 12:09:39'),
(212, 46, 2025, 'Septiembre', 'osvaldo_raul_martinez_17744953_septiembre_2025_empresa_1759838988_empleado_1759842025.pdf', '2025-10-07 12:09:46', 'Osvaldo Raul Martinez', '2025-10-07 10:00:25', 1, 'Transpol SRL', '2025-10-07 12:09:48'),
(213, 57, 2025, 'Septiembre', 'sergio_alberto_martinez_16474497_septiembre_2025_empresa_1759838996_empleado_1760119982.pdf', '2025-10-07 12:09:54', 'Sergio Alberto Martinez', '2025-10-10 15:13:02', 1, 'Transpol SRL', '2025-10-07 12:09:56'),
(214, 69, 2025, 'Septiembre', 'francisco_alejandro_morales_17126808_septiembre_2025_empresa_1759839008.pdf', '2025-10-07 12:10:06', NULL, NULL, 1, 'Transpol SRL', '2025-10-07 12:10:08'),
(215, 74, 2025, 'Septiembre', 'edgardo_facundo_morales_36999398_septiembre_2025_empresa_1759839019_empleado_1760362005.pdf', '2025-10-07 12:10:16', 'Edgardo Facundo Morales', '2025-10-13 10:26:45', 1, 'Transpol SRL', '2025-10-07 12:10:19'),
(216, 61, 2025, 'Septiembre', 'pablo_emanuel_moyano_30571009_septiembre_2025_empresa_1759839033_empleado_1759844919.pdf', '2025-10-07 12:10:31', 'Pablo Emanuel Moyano', '2025-10-07 10:48:39', 1, 'Transpol SRL', '2025-10-07 12:10:33'),
(217, 55, 2025, 'Septiembre', 'daniel_fernando_nievas_36134788_septiembre_2025_empresa_1759839045_empleado_1760556027.pdf', '2025-10-07 12:10:43', 'Daniel Fernando Nievas', '2025-10-15 16:20:27', 1, 'Transpol SRL', '2025-10-07 12:10:45'),
(218, 75, 2025, 'Septiembre', 'victor_alejandro_paoletti_18343307_septiembre_2025_empresa_1759839060_empleado_1760362570_empleado_1760362638.pdf', '2025-10-07 12:10:57', 'VICTOR ALEJANDRO PAOLETTI', '2025-10-13 10:37:18', 1, 'Transpol SRL', '2025-10-07 12:11:00'),
(219, 78, 2025, 'Septiembre', 'miguel_angel_pascolo_21515827_septiembre_2025_empresa_1759839074_empleado_1760450706.pdf', '2025-10-07 12:11:08', 'MIGUEL ANGEL PASCOLO', '2025-10-14 11:05:06', 1, 'Map SAS', '2025-10-07 12:11:14'),
(220, 76, 2025, 'Septiembre', 'heliana_maria__pizarro_24192706_septiembre_2025_empresa_1759839087_empleado_1760362178.pdf', '2025-10-07 12:11:25', 'HELIANA MARIA  PIZARRO', '2025-10-13 10:29:38', 1, 'Transpol SRL', '2025-10-07 12:11:27'),
(221, 14, 2025, 'Septiembre', 'ana_gabriela_pollicino_30108238_septiembre_2025_empresa_1759839106_empleado_1759920847.pdf', '2025-10-07 12:11:44', 'Ana Gabriela Pollicino', '2025-10-08 07:54:07', 1, 'Transpol SRL', '2025-10-07 12:11:46'),
(222, 79, 2025, 'Septiembre', 'sergio_manuel__puebla_20357306_septiembre_2025_empresa_1759839148_empleado_1760362362.pdf', '2025-10-07 12:12:25', 'Sergio Manuel  Puebla', '2025-10-13 10:32:42', 1, 'Map SAS', '2025-10-07 12:12:28'),
(223, 58, 2025, 'Septiembre', 'gabriel_antonio_repetto_24225490_septiembre_2025_empresa_1759839158_empleado_1759959993.pdf', '2025-10-07 12:12:37', 'GABRIEL ANTONIO REPETTO', '2025-10-08 18:46:33', 1, 'Transpol SRL', '2025-10-07 12:12:38'),
(224, 80, 2025, 'Septiembre', 'agustin_fabrizio_ribeiro_41112232_septiembre_2025_empresa_1759839168_empleado_1760362822.pdf', '2025-10-07 12:12:46', 'Agustin Fabrizio RiBeiro', '2025-10-13 10:40:22', 1, 'Map SAS', '2025-10-07 12:12:48'),
(225, 64, 2025, 'Septiembre', 'alberto_ceferino_rosales_24207056_septiembre_2025_empresa_1759839187_empleado_1759926304.pdf', '2025-10-07 12:13:04', 'Alberto Ceferino Rosales', '2025-10-08 09:25:04', 1, 'Transpol SRL', '2025-10-07 12:13:07'),
(226, 68, 2025, 'Septiembre', 'christian_maximiliano_varela_32426847_septiembre_2025_empresa_1759839199_empleado_1760362292.pdf', '2025-10-07 12:13:17', 'CHRISTIAN MAXIMILIANO VARELA', '2025-10-13 10:31:32', 1, 'Transpol SRL', '2025-10-07 12:13:19'),
(227, 70, 2025, 'Septiembre', 'marcelo_osvaldo_vega_23210202_septiembre_2025_empresa_1759839210_empleado_1760022599_empleado_1760444212.pdf', '2025-10-07 12:13:27', 'MARCELO OSVALDO VEGA', '2025-10-14 09:16:52', 1, 'Transpol SRL', '2025-10-07 12:13:30'),
(228, 72, 2025, 'Septiembre', 'guillermo_german_zabala_26779975_septiembre_2025_empresa_1759839219_empleado_1760362717.pdf', '2025-10-07 12:13:37', 'GUILLERMO GERMAN ZABALA', '2025-10-13 10:38:37', 1, 'Transpol SRL', '2025-10-07 12:13:39'),
(229, 73, 2025, 'Septiembre', 'cristian_carlos__zamora_31869936_septiembre_2025_empresa_1759839230_empleado_1759874141_empleado_1759874156.pdf', '2025-10-07 12:13:48', 'CRISTIAN CARLOS  ZAMORA', '2025-10-07 18:55:56', 1, 'Map SAS', '2025-10-07 12:13:50'),
(230, 83, 2025, 'Septiembre', 'agustin_gabriel_baradona_44405965_septiembre_2025_empresa_1759841153_empleado_1760362640.pdf', '2025-10-07 12:45:50', 'Agustin Gabriel Baradona', '2025-10-13 10:37:20', 1, 'Transpol SRL', '2025-10-07 12:45:53'),
(231, 62, 2025, 'Septiembre', 'gabriel_maidana__romero_40940426_septiembre_2025_empresa_1759933309_empleado_1760128066_empleado_1760128100.pdf', '2025-10-08 14:21:47', 'GABRIEL MAIDANA  ROMERO', '2025-10-10 17:28:20', 1, 'Transpol SRL', '2025-10-08 14:21:49'),
(232, 16, 2025, 'Octubre', 'nelson_javier_alday_26872026_octubre_2025_empresa_1762786725_empleado_1762866838.pdf', '2025-11-10 14:58:29', 'Nelson Javier Alday', '2025-11-11 10:13:58', 1, 'Transpol SRL', '2025-11-10 14:58:45'),
(233, 18, 2025, 'Octubre', 'damian_carlos_amaya_27101781_octubre_2025_empresa_1762786721_empleado_1762795574.pdf', '2025-11-10 14:58:38', 'Damian Carlos Amaya', '2025-11-10 14:26:14', 1, 'Transpol SRL', '2025-11-10 14:58:41'),
(234, 23, 2025, 'Octubre', 'cristian_facundo_arce_35547205_octubre_2025_empresa_1762786742_empleado_1763121663.pdf', '2025-11-10 14:58:59', 'Cristian Facundo Arce', '2025-11-14 09:01:03', 1, 'Transpol SRL', '2025-11-10 14:59:02'),
(235, 20, 2025, 'Octubre', 'oscar_gaston_atencio_27062238_octubre_2025_empresa_1762786754_empleado_1763119834.pdf', '2025-11-10 14:59:12', 'Oscar Gaston Atencio', '2025-11-14 08:30:34', 1, 'Transpol SRL', '2025-11-10 14:59:14'),
(236, 82, 2025, 'Octubre', 'gabriel_baradona_25924234_octubre_2025_empresa_1762786776_empleado_1763027857.pdf', '2025-11-10 14:59:31', 'Gabriel Baradona', '2025-11-13 06:57:37', 1, 'Transpol SRL', '2025-11-10 14:59:36'),
(237, 29, 2025, 'Octubre', 'cristian_agustin_canto_41338880_octubre_2025_empresa_1762786803_empleado_1763119987.pdf', '2025-11-10 15:00:00', 'Cristian Agustin Canto', '2025-11-14 08:33:07', 1, 'Transpol SRL', '2025-11-10 15:00:03'),
(238, 27, 2025, 'Octubre', 'carolina_elizabeth_brizuela_28225605_octubre_2025_empresa_1762787111_empleado_1763120963.pdf', '2025-11-10 15:05:09', 'Carolina Elizabeth Brizuela', '2025-11-14 08:49:23', 1, 'Map SAS', '2025-11-10 15:05:11'),
(239, 36, 2025, 'Octubre', 'maximiliano_alejandro_cardea_34308316_octubre_2025_empresa_1762787124_empleado_1762885676.pdf', '2025-11-10 15:05:22', 'Maximiliano Alejandro Cardea', '2025-11-11 15:27:56', 1, 'Transpol SRL', '2025-11-10 15:05:24'),
(240, 17, 2025, 'Octubre', 'leonardo_carmona_20335173_octubre_2025_empresa_1762787142_empleado_1763472608_empleado_1763810547.pdf', '2025-11-10 15:05:40', 'Leonardo Carmona', '2025-11-22 08:22:27', 1, 'Transpol SRL', '2025-11-10 15:05:42'),
(241, 34, 2025, 'Octubre', 'sergio_gustavo_carrillo_20887672_octubre_2025_empresa_1762787179_empleado_1762881700.pdf', '2025-11-10 15:06:15', 'Sergio Gustavo Carrillo', '2025-11-11 14:21:40', 1, 'Transpol SRL', '2025-11-10 15:06:19'),
(242, 26, 2025, 'Octubre', 'gabriel__cornejo_23240245_octubre_2025_empresa_1762787288_empleado_1763020776.pdf', '2025-11-10 15:08:06', 'GABRIEL  CORNEJO', '2025-11-13 04:59:36', 1, 'Transpol SRL', '2025-11-10 15:08:08'),
(243, 28, 2025, 'Octubre', 'alexis_espina_molina_35879403_octubre_2025_empresa_1762787336_empleado_1763120774.pdf', '2025-11-10 15:08:54', 'ALEXIS ESPINA MOLINA', '2025-11-14 08:46:14', 1, 'Map SAS', '2025-11-10 15:08:56'),
(244, 30, 2025, 'Octubre', 'carlos_fernandez_17258909_octubre_2025_empresa_1762787375_empleado_1762871231.pdf', '2025-11-10 15:09:33', 'CARLOS FERNANDEZ', '2025-11-11 11:27:11', 1, 'Transpol SRL', '2025-11-10 15:09:35'),
(245, 32, 2025, 'Octubre', 'jonathan_fernandez_32909739_octubre_2025_empresa_1762787387_empleado_1762802582.pdf', '2025-11-10 15:09:45', 'JONATHAN FERNANDEZ', '2025-11-10 16:23:02', 1, 'Transpol SRL', '2025-11-10 15:09:47'),
(246, 37, 2025, 'Octubre', 'enzo_ezequiel__fernandez_orrego_39377396_octubre_2025_empresa_1762787402_empleado_1763124574.pdf', '2025-11-10 15:09:59', 'ENZO EZEQUIEL  FERNANDEZ ORREGO', '2025-11-14 09:49:34', 1, 'Map SAS', '2025-11-10 15:10:02'),
(247, 33, 2025, 'Octubre', 'ezequiel_eduardo_fernandez_rufino_33053563_octubre_2025_empresa_1762787453_empleado_1762795721.pdf', '2025-11-10 15:10:51', 'EZEQUIEL EDUARDO FERNANDEZ RUFINO', '2025-11-10 14:28:41', 1, 'Map SAS', '2025-11-10 15:10:53'),
(248, 40, 2025, 'Octubre', 'ignacio_sebastian_flores_44746306_octubre_2025_empresa_1762787475_empleado_1763124454.pdf', '2025-11-10 15:11:12', 'IGNACIO SEBASTIAN FLORES', '2025-11-14 09:47:34', 1, 'Map SAS', '2025-11-10 15:11:15'),
(250, 45, 2025, 'Octubre', 'ciro_carlos_daniel_ghilardi_33517935_octubre_2025_empresa_1762787500_empleado_1762938341.pdf', '2025-11-10 15:11:38', 'Ciro Carlos Daniel Ghilardi', '2025-11-12 06:05:41', 1, 'Map SAS', '2025-11-10 15:11:40'),
(251, 47, 2025, 'Octubre', 'walter_osvaldo_giamportone_20626136_octubre_2025_empresa_1762787514_empleado_1762800884.pdf', '2025-11-10 15:11:53', 'WALTER OSVALDO GIAMPORTONE', '2025-11-10 15:54:44', 1, 'Transpol SRL', '2025-11-10 15:11:54'),
(252, 49, 2025, 'Octubre', 'ariel_hugo_gomez_41885399_octubre_2025_empresa_1762787527_empleado_1762867753.pdf', '2025-11-10 15:12:05', 'ARIEL HUGO GOMEZ', '2025-11-11 10:29:13', 1, 'Map SAS', '2025-11-10 15:12:07'),
(253, 48, 2025, 'Octubre', 'jose_fernando_gonzalez_26595183_octubre_2025_empresa_1762787542_empleado_1762882189.pdf', '2025-11-10 15:12:20', 'JOSE FERNANDO GONZALEZ', '2025-11-11 14:29:49', 1, 'Transpol SRL', '2025-11-10 15:12:22'),
(255, 53, 2025, 'Octubre', 'raul_roberto_gutierrez_26828602_octubre_2025_empresa_1762787948_empleado_1763130335_empleado_1763130357_empleado_1763130397.pdf', '2025-11-10 15:19:06', 'RAUL ROBERTO GUTIERREZ', '2025-11-14 11:26:37', 1, 'Transpol SRL', '2025-11-10 15:19:08'),
(256, 54, 2025, 'Octubre', 'jesus_gustavo_jofre_22316397_octubre_2025_empresa_1762787961.pdf', '2025-11-10 15:19:16', NULL, NULL, 1, 'Transpol SRL', '2025-11-10 15:19:21'),
(257, 39, 2025, 'Octubre', 'humberto_francisco_lacroux_23389257_octubre_2025_empresa_1762787972_empleado_1762939346.pdf', '2025-11-10 15:19:30', 'Humberto Francisco Lacroux', '2025-11-12 06:22:26', 1, 'Transpol SRL', '2025-11-10 15:19:32'),
(258, 41, 2025, 'Octubre', 'natalio_matias_lopez_34753664_octubre_2025_empresa_1762787986_empleado_1762947630.pdf', '2025-11-10 15:19:45', 'Natalio Matias Lopez', '2025-11-12 08:40:30', 1, 'Transpol SRL', '2025-11-10 15:19:46'),
(259, 84, 2025, 'Octubre', 'lucas_matias_lopez_34753665_octubre_2025_empresa_1762787999_empleado_1763118409.pdf', '2025-11-10 15:19:55', 'Lucas Matias Lopez', '2025-11-14 08:06:49', 1, 'Transpol SRL', '2025-11-10 15:19:59'),
(260, 43, 2025, 'Octubre', 'alexis_joel__lozano_esposito_38207021_octubre_2025_empresa_1762788202_empleado_1763038074.pdf', '2025-11-10 15:20:32', 'Alexis Joel  Lozano Esposito', '2025-11-13 09:47:54', 1, 'Map SAS', '2025-11-10 15:23:22'),
(261, 44, 2025, 'Octubre', 'hector_eduardo_lujan_24058172_octubre_2025_empresa_1762788223_empleado_1762795905.pdf', '2025-11-10 15:23:42', 'Hector Eduardo Lujan', '2025-11-10 14:31:45', 1, 'Transpol SRL', '2025-11-10 15:23:43'),
(262, 50, 2025, 'Octubre', 'sebastian_alejandro_manzo_29787821_octubre_2025_empresa_1762788241_empleado_1762789270.pdf', '2025-11-10 15:23:59', 'Sebastian Alejandro Manzo', '2025-11-10 12:41:10', 1, 'Transpol SRL', '2025-11-10 15:24:01'),
(263, 46, 2025, 'Octubre', 'osvaldo_raul_martinez_17744953_octubre_2025_empresa_1762788255_empleado_1762876141.pdf', '2025-11-10 15:24:13', 'Osvaldo Raul Martinez', '2025-11-11 12:49:01', 1, 'Transpol SRL', '2025-11-10 15:24:15'),
(264, 57, 2025, 'Octubre', 'sergio_alberto_martinez_16474497_octubre_2025_empresa_1762788267.pdf', '2025-11-10 15:24:25', NULL, NULL, 1, 'Transpol SRL', '2025-11-10 15:24:27'),
(265, 69, 2025, 'Octubre', 'francisco_alejandro_morales_17126808_octubre_2025_empresa_1762788282_empleado_1762865530_empleado_1762865566.pdf', '2025-11-10 15:24:39', 'Francisco Alejandro Morales', '2025-11-11 09:52:46', 1, 'Transpol SRL', '2025-11-10 15:24:42'),
(266, 61, 2025, 'Octubre', 'pablo_emanuel_moyano_30571009_octubre_2025_empresa_1762788301_empleado_1763046312.pdf', '2025-11-10 15:24:59', 'Pablo Emanuel Moyano', '2025-11-13 12:05:12', 1, 'Transpol SRL', '2025-11-10 15:25:01'),
(267, 55, 2025, 'Octubre', 'daniel_fernando_nievas_36134788_octubre_2025_empresa_1762788318_empleado_1762947614.pdf', '2025-11-10 15:25:12', 'Daniel Fernando Nievas', '2025-11-12 08:40:14', 1, 'Transpol SRL', '2025-11-10 15:25:18'),
(268, 75, 2025, 'Octubre', 'victor_alejandro_paoletti_18343307_octubre_2025_empresa_1762788335_empleado_1763118343.pdf', '2025-11-10 15:25:28', 'VICTOR ALEJANDRO PAOLETTI', '2025-11-14 08:05:43', 1, 'Transpol SRL', '2025-11-10 15:25:35'),
(269, 78, 2025, 'Octubre', 'miguel_angel_pascolo_21515827_octubre_2025_empresa_1762788351_empleado_1763129908.pdf', '2025-11-10 15:25:48', 'MIGUEL ANGEL PASCOLO', '2025-11-14 11:18:28', 1, 'Map SAS', '2025-11-10 15:25:51'),
(270, 76, 2025, 'Octubre', 'heliana_maria__pizarro_24192706_octubre_2025_empresa_1762788364_empleado_1763134149.pdf', '2025-11-10 15:26:02', 'HELIANA MARIA  PIZARRO', '2025-11-14 12:29:09', 1, 'Transpol SRL', '2025-11-10 15:26:04'),
(271, 14, 2025, 'Octubre', 'ana_gabriela_pollicino_30108238_octubre_2025_empresa_1762788388_empleado_1762788572.pdf', '2025-11-10 15:26:26', 'Ana Gabriela Pollicino', '2025-11-10 12:29:32', 1, 'Transpol SRL', '2025-11-10 15:26:28'),
(272, 79, 2025, 'Octubre', 'sergio_manuel__puebla_20357306_octubre_2025_empresa_1762788406_empleado_1762987369_empleado_1763119811.pdf', '2025-11-10 15:26:37', 'Sergio Manuel  Puebla', '2025-11-14 08:30:11', 1, 'Map SAS', '2025-11-10 15:26:46'),
(273, 58, 2025, 'Octubre', 'gabriel_antonio_repetto_24225490_octubre_2025_empresa_1762788421_empleado_1763118310.pdf', '2025-11-10 15:26:59', 'GABRIEL ANTONIO REPETTO', '2025-11-14 08:05:10', 1, 'Transpol SRL', '2025-11-10 15:27:01'),
(274, 80, 2025, 'Octubre', 'agustin_fabrizio_ribeiro_41112232_octubre_2025_empresa_1762788437_empleado_1763119920.pdf', '2025-11-10 15:27:15', 'Agustin Fabrizio RiBeiro', '2025-11-14 08:32:00', 1, 'Map SAS', '2025-11-10 15:27:17'),
(275, 85, 2025, 'Octubre', 'miguel__romeo_32665110_octubre_2025_empresa_1762788451_empleado_1763120268.pdf', '2025-11-10 15:27:29', 'MIGUEL  ROMEO', '2025-11-14 08:37:48', 1, 'Transpol SRL', '2025-11-10 15:27:31'),
(276, 62, 2025, 'Octubre', 'gabriel_maidana__romero_40940426_octubre_2025_empresa_1762788464_empleado_1762953076.pdf', '2025-11-10 15:27:42', 'GABRIEL MAIDANA  ROMERO', '2025-11-12 10:11:16', 1, 'Transpol SRL', '2025-11-10 15:27:44'),
(277, 64, 2025, 'Octubre', 'alberto_ceferino_rosales_24207056_octubre_2025_empresa_1762788481_empleado_1762802492_empleado_1762802708_empleado_1762864688_empleado_1762864724.pdf', '2025-11-10 15:27:55', 'Alberto Ceferino Rosales', '2025-11-11 09:38:44', 1, 'Transpol SRL', '2025-11-10 15:28:01'),
(278, 68, 2025, 'Octubre', 'christian_maximiliano_varela_32426847_octubre_2025_empresa_1762788496_empleado_1762862810.pdf', '2025-11-10 15:28:15', 'CHRISTIAN MAXIMILIANO VARELA', '2025-11-11 09:06:50', 1, 'Transpol SRL', '2025-11-10 15:28:16'),
(279, 70, 2025, 'Octubre', 'marcelo_osvaldo_vega_23210202_octubre_2025_empresa_1762788510_empleado_1762802400.pdf', '2025-11-10 15:28:29', 'MARCELO OSVALDO VEGA', '2025-11-10 16:20:00', 1, 'Transpol SRL', '2025-11-10 15:28:30'),
(280, 72, 2025, 'Octubre', 'guillermo_german_zabala_26779975_octubre_2025_empresa_1762788523_empleado_1763119500.pdf', '2025-11-10 15:28:41', 'GUILLERMO GERMAN ZABALA', '2025-11-14 08:25:00', 1, 'Transpol SRL', '2025-11-10 15:28:43'),
(281, 73, 2025, 'Octubre', 'cristian_carlos__zamora_31869936_octubre_2025_empresa_1762788535_empleado_1763051981.pdf', '2025-11-10 15:28:53', 'CRISTIAN CARLOS  ZAMORA', '2025-11-13 13:39:41', 1, 'Map SAS', '2025-11-10 15:28:55'),
(282, 42, 2025, 'Octubre', 'pablo_roman_garay_34025853_octubre_2025_empresa_1762944945_empleado_1763238103.pdf', '2025-11-12 10:55:42', 'PABLO ROMAN GARAY', '2025-11-15 17:21:43', 1, 'Transpol SRL', '2025-11-12 10:55:45'),
(285, 52, 2025, 'Octubre', 'angel_alberto_gutierrez_16061879_octubre_2025_empresa_1763388378_empleado_1763388641.pdf', '2025-11-17 14:06:09', 'ANGEL ALBERTO GUTIERREZ', '2025-11-17 11:10:41', 1, 'Transpol SRL', '2025-11-17 14:06:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tprocesos`
--

CREATE TABLE `tprocesos` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tproveedores`
--

CREATE TABLE `tproveedores` (
  `id` int NOT NULL,
  `razon_social` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cuit` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `contacto` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_spanish_ci,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tproveedores`
--

INSERT INTO `tproveedores` (`id`, `razon_social`, `cuit`, `contacto`, `direccion`, `telefono`) VALUES
(12, 'R&S Rep y serv Neumaticos (Schiavone)', '20-21705666-8', '', 'Caseros 334 - Las Heras', ''),
(13, 'CAMPIONE EDUARDO GUSTAVO', '23-20449593-9', '', 'Acc. Norte km:6 - Las Heras', ''),
(14, 'NVZ SAS - VINARV', '30-71840471-8', '', 'COLOMBIA 2124 - GUAYMALLEN', '2617485378'),
(15, 'CONA - Ferreteria y Buloneria', '23-92516621-9', '', 'Marcos Burgos 565 - Las Heras', ''),
(16, 'Paul LLaver Neumaticos', '30-70936768-0', 'Paul LLaver', 'Lavalle 1142 - Rivadavia - Mendoza', ''),
(17, 'Arturo Yacopini e Hijos SA', '30-54330821-4', '', 'Rodriguez PeÃ±a 744 - esq Av. Gabrielli - Maipu - Mendoza', '261-2543980'),
(18, 'GGD INTEGRAL SA', '30709472468', '', 'MONTECASEROS 1872 - MENDOZA', ''),
(19, 'MEXTREM - JV EXTREM SAS', '33718790889', '', 'CRISTO BLANCO - TRES ESQUINAS DE CRUZ DE PIEDRA', ''),
(20, 'Farreras Servicio integral', '20-43638329-1', 'Agustin Farreras', 'Bv. Los Horcones 2881 - El Challao - Mendoza', ''),
(21, 'Repuestos Izquierdo', '20-08157556-9', '', 'Gral. Espejo 598 - Las Heras - Mendoza', ''),
(22, 'Autoclima', '20-30888956-5', '', 'Carril Rodriguez PeÃ±a 1722 - Godoy Cruz', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `troles`
--

CREATE TABLE `troles` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `troles`
--

INSERT INTO `troles` (`id`, `nombre`) VALUES
(10, 'CHOFER');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trrhh`
--

CREATE TABLE `trrhh` (
  `id` int NOT NULL,
  `idPersona` int NOT NULL,
  `idRol` int NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tserviciosmonitoreables`
--

CREATE TABLE `tserviciosmonitoreables` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `acumulable` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tserviciosmonitoreables`
--

INSERT INTO `tserviciosmonitoreables` (`id`, `nombre`, `acumulable`) VALUES
(1, 'Cambio de Aceite', 0),
(2, 'Cambio de cubiertas', 1),
(3, 'Cambio de pastillas de freno', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tserviciosvehiculo`
--

CREATE TABLE `tserviciosvehiculo` (
  `id` int NOT NULL,
  `idVehiculo` int NOT NULL,
  `idArticulo` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `dniPersona` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_servicio` datetime DEFAULT CURRENT_TIMESTAMP,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `kmRecorridos` int NOT NULL,
  `totalitemservicio` float NOT NULL,
  `idserviciomonitoreable` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tserviciosvehiculo`
--

INSERT INTO `tserviciosvehiculo` (`id`, `idVehiculo`, `idArticulo`, `cantidad`, `dniPersona`, `fecha_servicio`, `descripcion`, `kmRecorridos`, `totalitemservicio`, `idserviciomonitoreable`) VALUES
(20, 35, 67, 12.00, '24225490', '2025-11-06 12:48:11', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 200819, 0, 0),
(21, 52, 67, 12.00, '24225490', '2025-11-07 10:00:51', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 150622, 0, 0),
(22, 31, 67, 12.00, '24225490', '2025-11-07 10:02:35', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 480494, 0, 0),
(23, 39, 67, 12.00, '24225490', '2025-11-07 10:05:55', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 133652, 0, 0),
(24, 7, 67, 12.00, '24225490', '2025-11-07 10:07:34', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 553464, 0, 0),
(25, 25, 67, 40.00, '24225490', '2025-11-07 10:11:22', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 544695, 0, 0),
(26, 46, 68, 16.00, '24225490', '2025-11-07 10:30:15', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 836305, 0, 0),
(27, 48, 67, 12.00, '24225490', '2025-11-07 10:35:10', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 78322, 0, 0),
(28, 28, 67, 11.00, '24225490', '2025-11-07 10:36:28', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 103161, 0, 0),
(29, 51, 67, 12.00, '24225490', '2025-11-07 13:40:00', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 82988, 0, 1),
(30, 21, 67, 12.00, '24225490', '2025-11-07 13:43:00', 'CAMBIO DE ACEITE Y FILTROS POR SERVICE', 328374, 0, 1),
(32, 25, 97, 1.00, '24225490', '2025-11-06 11:20:00', 'Reparacion compresorKmorr 86 mm serie5', 545019, 598950, 0),
(37, 46, 100, 1.00, '24225490', '2025-11-10 12:03:00', 'Se cambio tapa de compresor por rotura', 837948, 0, 0),
(38, 46, 102, 1.00, '24225490', '2025-11-10 15:06:00', 'Se cambio servoembrague por rotura (se usa stock en deposito)', 837948, 0, 0),
(39, 13, 104, 1.00, '24225490', '2025-11-13 13:07:00', 'Se cambia por falla', 269512, 1459530, 0),
(40, 7, 106, 1.00, '35879403', '2025-11-10 13:14:00', 'Arranque reparado en deposito A6519060026', 0, 0, 0),
(41, 51, 108, 1.00, '24225490', '2025-10-29 09:59:00', '', 82988, 0, 3),
(42, 20, 107, 1.00, '24225490', '2025-11-15 10:01:00', '', 771314, 0, 3),
(43, 25, 105, 1.00, '24225490', '2025-11-11 12:57:00', '', 545019, 0, 0),
(44, 29, 67, 12.00, '24225490', '2025-11-14 13:00:00', 'CAMBIO DE ACEITE POR SERVICE', 129201, 0, 1),
(45, 23, 67, 12.00, '24225490', '2025-11-17 13:03:00', 'CAMBIO DE ACEITE POR SERVICE', 260562, 0, 1),
(46, 8, 122, 2.00, '24225490', '2025-11-20 14:44:00', 'Se cambian amortiguadores del eje delantero', 0, 0, 0),
(49, 20, 125, 1.00, '24225490', '2025-11-22 15:15:00', 'Se cambia por perdida de aceite', 771330, 0, 0),
(50, 43, 67, 10.50, '35879403', '2025-11-25 10:51:00', 'CAMBIO DE ACEITE POR SERVICE', 61890, 0, 1),
(51, 52, 67, 11.50, '35879403', '2025-11-25 10:53:00', 'CAMBIO DE ACEITE POR SERVICE', 151432, 0, 1),
(52, 61, 127, 2.00, '26779975', '2025-11-13 11:56:00', 'desarme, arreglo, calibracion y colocacion de cerraduras en ambas puertas', 0, 190000, 0),
(53, 36, 141, 1.00, '20626136', '2025-11-17 12:47:00', '', 0, 326700, 0),
(54, 36, 142, 1.00, '20626136', '2025-11-17 15:48:00', '', 0, 72600, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tstock`
--

CREATE TABLE `tstock` (
  `id` int NOT NULL,
  `idArticulo` int NOT NULL,
  `idUbicacion` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ttipocombustible`
--

CREATE TABLE `ttipocombustible` (
  `idtipo` int NOT NULL,
  `nombrecombustible` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `ttipocombustible`
--

INSERT INTO `ttipocombustible` (`idtipo`, `nombrecombustible`) VALUES
(1, 'Diesel 500'),
(2, 'Infinia Diesel'),
(3, 'Infinia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tubicaciones`
--

CREATE TABLE `tubicaciones` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tuso`
--

CREATE TABLE `tuso` (
  `id` int NOT NULL,
  `idVehiculo` int NOT NULL,
  `idPersona` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `kmActuales` int NOT NULL,
  `remito` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `tipocombustible` int NOT NULL,
  `litros` float NOT NULL,
  `montototal` float NOT NULL,
  `precintoentrada` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `precintosalida` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `centrodecarga` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tuso`
--

INSERT INTO `tuso` (`id`, `idVehiculo`, `idPersona`, `fecha`, `hora`, `kmActuales`, `remito`, `tipocombustible`, `litros`, `montototal`, `precintoentrada`, `precintosalida`, `centrodecarga`) VALUES
(22, 52, 26, '2025-11-09', '08:00:00', 145537, '15541', 2, 38.53, 65457.4, '', '', 4),
(23, 52, 26, '2025-11-11', '16:44:00', 146072, '15898', 2, 39.43, 66995, '', '', 4),
(24, 39, 70, '2025-11-12', '18:39:00', 137337, '15902', 2, 63.41, 107543, '', '', 4),
(25, 35, 64, '2025-11-12', '18:39:00', 204200, '33471', 2, 60.33, 102328, '', '', 4),
(27, 52, 26, '2025-11-12', '17:00:00', 146613, '15570', 2, 40.65, 68937.3, '', '', 4),
(28, 21, 57, '2025-11-03', '17:50:00', 331741, '15881', 2, 57.36, 95561.8, '', '', 4),
(29, 21, 57, '2025-11-05', '17:50:00', 332460, '33449', 2, 64.34, 108288, '', '', 4),
(30, 21, 57, '2025-11-07', '17:50:00', 333112, '15533', 2, 57.06, 95917.9, '', '', 4),
(31, 21, 57, '2025-11-10', '17:50:00', 333752, '15547', 2, 57.48, 97658.5, '', '', 4),
(32, 21, 57, '2025-11-12', '17:50:00', 334312, '15903', 2, 63.52, 90761.4, '', '', 4),
(33, 23, 79, '2025-11-01', '18:00:00', 257045, '33432', 2, 47.79, 79764.9, '', '', 4),
(34, 23, 79, '2025-11-04', '18:00:00', 257615, '15505', 2, 55.93, 93003.3, '', '', 4),
(35, 23, 79, '2025-11-06', '18:00:00', 258140, '15523', 2, 54.07, 90895, '', '', 4),
(36, 23, 79, '2025-11-10', '18:00:00', 258667, '15896', 2, 49.87, 84724, '', '', 4),
(37, 23, 79, '2025-11-11', '18:00:00', 259061, '33468', 2, 43.38, 73702.6, '', '', 4),
(38, 23, 79, '2025-11-13', '18:00:00', 259551, '15904', 2, 48.9, 84005, '', '', 4),
(39, 23, 79, '2025-11-14', '18:00:00', 260000, '33486', 2, 47.65, 81719.8, '', '', 4),
(40, 23, 79, '2025-11-17', '18:00:00', 260563, '33495', 2, 55.03, 95416.8, '', '', 4),
(42, 51, 65, '2025-11-01', '18:06:00', 83247, '15484', 2, 57.31, 95653.7, '', '', 4),
(43, 51, 65, '2025-11-11', '18:06:00', 83859, '15549', 2, 67.4, 114504, '', '', 4),
(44, 51, 65, '2025-11-15', '18:06:00', 84296, '15594', 2, 50.14, 87034.5, '', '', 4),
(45, 23, 43, '2025-11-20', '21:04:00', 261342, '15631', 2, 39.66, 69294.8, '', '', 4),
(46, 33, 53, '2025-11-21', '20:29:00', 30399, '15649', 2, 36.02, 63503.3, '', '', 4),
(47, 30, 24, '2025-11-21', '08:03:00', 61447, '15637', 2, 66.66, 117525, '', '', 4),
(48, 28, 47, '2025-11-22', '10:24:00', 105908, '15651', 2, 34.04, 59871.1, '', '', 4),
(49, 36, 77, '2025-11-22', '08:23:00', 0, '176493', 1, 155.48, 247835, 's/p', '1207935', 1),
(50, 38, 20, '2025-11-22', '08:23:00', 549007, '176483', 1, 167.61, 267170, '1207975', '1207945', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tusuarios`
--

CREATE TABLE `tusuarios` (
  `id` int NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `idPermisos` int DEFAULT NULL,
  `userid` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tusuarios`
--

INSERT INTO `tusuarios` (`id`, `email`, `nombre`, `idPermisos`, `userid`) VALUES
(2, 'alemarchena@gmail.com', 'Ale Marchena', 8, 'jWMOyGUzBtZimCybv8zYMmAOUrl1'),
(4, 'transpol.trafico@gmail.com', 'Transpol Trafico', 1, 'jEIHVdsNzUdKtyWMlb5K3cTKTrp2'),
(6, 'transpolsrl@gmail.com', 'Gerencia TRANSPOL', 1, 'v8NPsCd0iKcbsNBftzzMgYEkPYi1'),
(8, 'transpol.srl.mza@gmail.com', 'Transpol S.R.L.', 4, 'DJS3NkQQnZbLrvuKD0apdwmjwFs2'),
(11, 'mgdanielali2020@gmail.com', 'Daniel Alberto Ali', 3, 'TMm4X0zlRmTZOTAq14DBeZkzaNq1'),
(12, 'sirio372011@gmail.com', 'Daniel Ali', 0, 'FQj7gvm3HiYVVUM6XgG2hXGhavc2'),
(13, 'aguss1046@gmail.com', 'Agustin Ribeiro', 0, 'LaiKYwezpTMFxxymexUvyo6keQB3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tvehiculos`
--

CREATE TABLE `tvehiculos` (
  `id` int NOT NULL,
  `patente` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `marca` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `anio` int DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci,
  `modelo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `numerointerno` varchar(50) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `cantidadbutacas` int DEFAULT NULL,
  `numerochasis` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `kmfrecuenciacambioaceite` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tvehiculos`
--

INSERT INTO `tvehiculos` (`id`, `patente`, `marca`, `anio`, `descripcion`, `modelo`, `numerointerno`, `cantidadbutacas`, `numerochasis`, `kmfrecuenciacambioaceite`) VALUES
(5, 'AG465XE', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '03', 0, '8AC907631RE241661', 15000),
(6, 'PHW 167', 'MERCEDES BENZ', 2015, '', 'SPRINTER', '15', 15, '8AC906633GE117295', 15000),
(7, 'AA014GU', 'MERCEDES BENZ', 2016, '', 'SPRINTER', '28', 19, '8AC906657GE119788', 15000),
(8, 'AF733CQ', 'SCANIA', 2023, '', 'METALSUR', '91', 60, '9BSK6X200P4015412', 30000),
(13, 'AE604EE', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '04', 15, '8AC907843ME191419', 15000),
(14, 'AG194BT', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '08', 15, '8AC907843RE238495', 15000),
(15, 'MJN005', 'MERCEDES BENZ', 2013, '', 'LA FAVORITA 1722', '09', 45, '9BM384078DB879711', 20000),
(16, 'AD378IK', 'SCANIA', 2018, '', 'COMIL', '105', 58, '9BSK6X200J3926145', 30000),
(17, 'AH261XK', 'MERCEDES BENZ', 2025, '', 'SALDIVIA', '115', 46, '9BM382185SB39814', 20000),
(18, 'AD275DR', 'MERCEDES BENZ', 2019, '', 'SPRINTER', '12', 15, 'BAC906633KE159262', 15000),
(19, 'AE707ZC', 'IVECO', 2021, '', 'DAILY 50c16', '16', 19, '93ZK50C01J8480138', 15000),
(20, 'LVB304', 'MERCEDES BENZ', 2013, '', 'SPRINTER', '17', 15, '8AC906633CE064128', 15000),
(21, 'AE893IL', 'MERCEDES BENZ', 2021, '', 'SPRINTER', '18', 15, '8AC907843NE200643', 15000),
(22, 'LEW597', 'MERCEDES BENZ', 2013, '', 'LA FAVORITA 1722', '22', 45, '9BM384078BB751011', 20000),
(23, 'AF459ZY', 'MERCEDES BENZ', 2022, '', 'SPRINTER', '23', 15, '8AC9077843PE218927', 15000),
(24, 'AG725GZ', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '33', 15, '8AC907843SE253733', 15000),
(25, 'AD183BG', 'SCANIA', 2018, '', 'TROYANO', '38', 60, '9BSK6X200J3907046', 30000),
(26, 'OXT450', 'MERCEDES BENZ', 2015, '', 'SPRINTER', '47', 15, '8AC906633GE110235', 15000),
(27, 'PKP_989', 'MERCEDES BENZ', 2016, '', 'SPRINTER', '48', 15, '8AC906633GE111558', 15000),
(28, 'AF711LL', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '49', 0, '8AC907631PE227416', 15000),
(29, 'AF634TH', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '06', 19, '8AC907857PE219719', 15000),
(30, 'AG475CD', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '07', 19, '8AC907857RE2455314', 15000),
(31, 'AC678QD', 'MERCEDES BENZ', 2018, '', 'SPRINTER', '10', 19, '8AC906657JE149694', 15000),
(32, 'AG168XF', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '11', 19, '8AC907857RE238434', 15000),
(33, 'AH075OB', 'MERCEDES BENZ', 2025, '', 'SPRINTER', '14', 19, '8AC907857SE260809', 15000),
(34, 'AE692RO', 'MERCEDES BENZ', 2021, '', 'SPRINTER', '20', 19, '8AC907857ME196555', 15000),
(35, 'AF593PH', 'MERCEDES BENZ', 2022, '', 'SPRINTER', '21', 19, '8AC907857PE224514', 15000),
(36, 'LRM319', 'MERCEDES BENZ', 2013, '', 'LA FAVORITA 1722', '24', 45, '9BM384078CB820772', 20000),
(37, 'OXC507', 'MERCEDES BENZ', 2015, '', 'METALPAR 1418', '25', 44, '8AB384067FA301424', 20000),
(38, 'NKB771', 'MERCEDES BENZ', 2014, '', 'LA FAVORITA 1722', '26', 47, '9BM384078EB914929', 20000),
(39, 'AF909WC', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '27', 19, '8AC907857PE232737', 15000),
(40, 'MRD554', 'MERCEDES BENZ', 2013, '', 'LA FAVORTIA 1722', '29', 45, '9BM384078DB895494', 20000),
(41, 'AF151NO', 'MERCEDES BENZ', 2021, '', 'SPRINTER', '30', 19, '8AC907857NE210907', 15000),
(42, 'AH115DS', 'MERCEDES BENZ', 2025, '', 'SPRINTER', '31', 19, '8AC907857SE261593', 15000),
(43, 'AG606FV', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '32', 19, '8AC907857RE248564', 15000),
(44, 'AG475CE', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '35', 19, '8AC907857RE243778', 15000),
(45, 'AB783TX', 'MERCEDES BENZ', 2017, '', 'METALPAR 1416', '36', 41, '9BM384067JB063555', 20000),
(46, 'AA017TO', 'MERCEDES BENZ', 2016, '', 'METALPAR ', '39', 48, '8AB384078GA301911', 20000),
(47, 'AB807YD', 'MERCEDES BENZ', 2017, '', 'METALPAR', '40', 41, '8AB384067HA302145', 20000),
(48, 'AG331DA', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '41', 19, '8AC907857RE240617', 15000),
(49, 'AB854WF', 'MERCEDES BENZ', 2017, '', 'METALPAR', '45', 40, '9BM384067JB060450', 20000),
(50, 'AG084GF', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '70', 19, '8AC907857RE237333', 15000),
(51, 'AG008IM', 'MERCEDES BENZ', 2024, '', 'SPRINTER', '77', 19, '8AC907857RE235360', 15000),
(52, 'AF932DW', 'MERCEDES BENZ', 2023, '', 'SPRINTER', '05', 0, '8AC907631PE231789', 15000),
(54, 'AH262YF', 'MERCEDES BENZ', 2025, '', 'SPRINTER 517', '19', 19, '8AC907857TE265757', 15000),
(58, 'AH446GK', 'MERCEDES BENZ', 2025, '', 'SPRINTER 517', '34', 19, '8AC907857TE266506', 15000),
(59, 'AG810HF', 'MERCEDES BENZ', 2024, '', 'SPRINTER 517', '13', 19, '8AC904657FE108215', 15000),
(60, 'AD890AA', 'MERCEDES BENZ', 2019, '', 'O500RSD', '83', 0, '9BM634061JB089419', 15000),
(61, 'AH566VN', 'MERCEDES BENZ', 2025, '', '814-o-500 RSD', '102', 60, '9B634074TB418936', 30000),
(62, 'xx', 'xx', 2010, 'Unidad de NG', 'xx', '01 - Micro NG', 45, 'xx', 0),
(67, 'xx2', 'xx2', 2010, 'Unidad de NG', 'xx2', '02 - Micro NG', 45, 'xx2', 0),
(68, 'xx3', 'xx3', 2010, 'Unidad NG', 'xx3', '03 B - Micro NG', 45, 'xx3', 0),
(69, 'xx4', 'xx4', 2010, 'Unidad NG', 'xx4', '04 B - Micro NG', 45, 'xx4', 0),
(70, 'xx7', 'xx7', 2010, 'Unidad NG', 'xx7', '07 B - Micro NG', 45, 'xx7', 0),
(71, 'xx8', 'xx8', 2010, 'Unidad NG', 'xx8', '08 B - Micro NG', 45, 'xx8', 0),
(72, 'xx9', 'xx9', 2010, 'Unidad NG', 'xx9', '09 B - Micro NG', 45, 'xx9', 0),
(73, 'xx10', 'xx10', 2010, 'Unidad NG', 'xx10', '10 B - Sprinter NG', 19, 'xx10', 0),
(74, 'xx11', 'xx11', 2010, 'Unidad NG', 'xx11', '11 B - Micro NG', 45, 'xx11', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tvencimientos`
--

CREATE TABLE `tvencimientos` (
  `id` int NOT NULL,
  `idPersona` int NOT NULL,
  `idObligacionRol` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `idRol` int NOT NULL,
  `loTiene` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tvencimientosvehiculos`
--

CREATE TABLE `tvencimientosvehiculos` (
  `id` int NOT NULL,
  `idVehiculo` int NOT NULL,
  `idObligacionVehiculo` int NOT NULL,
  `lotiene` tinyint(1) NOT NULL DEFAULT '1',
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tvencimientosvehiculos`
--

INSERT INTO `tvencimientosvehiculos` (`id`, `idVehiculo`, `idObligacionVehiculo`, `lotiene`, `fecha`) VALUES
(89, 5, 17, 1, '2025-11-15'),
(90, 5, 13, 1, NULL),
(91, 5, 15, 1, '2030-05-01'),
(92, 5, 16, 1, '2026-02-14'),
(93, 5, 12, 1, '2025-11-14'),
(94, 5, 11, 1, '2026-01-02'),
(95, 13, 17, 1, '2025-11-15'),
(96, 13, 13, 1, NULL),
(97, 13, 15, 1, '2030-05-01'),
(98, 13, 16, 1, '2025-12-06'),
(99, 13, 12, 1, '2025-11-14'),
(100, 13, 11, 1, '2025-11-27'),
(101, 52, 17, 1, '2025-11-15'),
(102, 52, 13, 1, NULL),
(103, 52, 15, 1, '2030-05-01'),
(104, 52, 16, 1, '2025-11-24'),
(105, 52, 12, 1, '2025-11-14'),
(106, 52, 11, 1, '2026-01-02'),
(107, 29, 17, 1, '2025-11-15'),
(108, 29, 13, 1, NULL),
(109, 29, 15, 1, '2030-05-01'),
(110, 29, 16, 1, '2026-10-31'),
(111, 29, 12, 1, '2025-11-14'),
(112, 29, 11, 1, '2025-11-27'),
(113, 30, 17, 1, '2025-11-15'),
(114, 30, 13, 1, NULL),
(115, 30, 15, 1, '2030-05-01'),
(116, 30, 16, 1, '2026-02-28'),
(117, 30, 12, 1, '2025-11-14'),
(118, 30, 11, 1, '2025-12-01'),
(119, 14, 17, 1, '2025-11-15'),
(120, 14, 13, 1, NULL),
(121, 14, 15, 1, '2030-05-01'),
(122, 14, 16, 1, '2026-05-14'),
(123, 14, 12, 1, '2025-11-14'),
(124, 14, 11, 1, '2025-12-05'),
(125, 15, 17, 1, '2025-11-15'),
(126, 15, 13, 1, NULL),
(127, 15, 15, 1, '2030-05-01'),
(128, 15, 16, 1, '2025-12-15'),
(129, 15, 12, 1, '2025-11-15'),
(130, 15, 11, 1, '2025-12-12'),
(131, 31, 17, 1, '2025-11-15'),
(132, 31, 13, 1, NULL),
(133, 31, 15, 1, '2030-05-01'),
(134, 31, 16, 1, '2026-03-15'),
(135, 31, 12, 1, '2025-11-15'),
(136, 31, 11, 1, '2025-09-09'),
(137, 32, 17, 1, '2025-11-15'),
(138, 32, 13, 1, NULL),
(139, 32, 15, 1, '2030-05-01'),
(140, 32, 16, 1, '2026-04-15'),
(141, 32, 12, 1, '2025-11-14'),
(142, 32, 11, 1, '2025-12-05'),
(143, 18, 17, 1, '2025-11-15'),
(144, 18, 13, 1, NULL),
(145, 18, 15, 1, '2030-05-01'),
(146, 18, 16, 1, '2026-01-05'),
(147, 18, 12, 1, '2025-11-14'),
(148, 18, 11, 1, '2025-11-20'),
(149, 33, 17, 1, '2025-11-15'),
(150, 33, 13, 1, NULL),
(151, 33, 15, 1, '2030-05-01'),
(152, 33, 16, 1, '2026-01-16'),
(153, 33, 12, 1, '2025-11-14'),
(154, 33, 11, 1, '2026-01-20'),
(155, 6, 17, 1, '2025-11-15'),
(156, 6, 13, 1, NULL),
(157, 6, 15, 1, '2030-05-01'),
(158, 6, 16, 1, '2026-03-15'),
(159, 6, 12, 1, '2025-11-11'),
(160, 6, 11, 1, '2025-12-03'),
(161, 19, 17, 1, '2025-10-15'),
(162, 19, 13, 1, NULL),
(163, 19, 15, 1, '2030-05-01'),
(164, 19, 16, 1, '2026-01-05'),
(165, 19, 12, 1, '2025-11-14'),
(166, 19, 11, 1, '2025-11-18'),
(167, 20, 17, 1, '2025-11-15'),
(168, 20, 13, 1, NULL),
(169, 20, 15, 1, '2030-05-01'),
(170, 20, 16, 1, '2026-03-15'),
(171, 20, 12, 1, '2025-11-14'),
(172, 20, 11, 1, '2025-11-13'),
(173, 21, 17, 1, '2025-11-15'),
(174, 21, 13, 1, NULL),
(175, 21, 15, 1, '2030-05-01'),
(176, 21, 16, 1, '2026-04-15'),
(177, 21, 12, 1, '2025-11-14'),
(178, 21, 11, 1, '2025-11-27'),
(179, 34, 17, 1, '2025-11-15'),
(181, 34, 15, 1, '2030-05-01'),
(182, 34, 16, 1, '2026-09-08'),
(183, 34, 12, 1, '2025-11-14'),
(184, 34, 11, 1, '2025-12-17'),
(185, 35, 17, 1, '2025-11-15'),
(186, 35, 13, 1, NULL),
(187, 35, 15, 1, '2030-05-01'),
(188, 35, 16, 1, '2026-10-27'),
(189, 35, 12, 1, '2025-11-14'),
(190, 35, 11, 1, '2025-11-27'),
(191, 22, 17, 1, '2025-11-15'),
(192, 22, 13, 1, NULL),
(193, 22, 15, 1, '2030-05-01'),
(194, 22, 16, 1, '2025-11-15'),
(195, 22, 12, 1, '2025-11-14'),
(196, 22, 11, 1, '2025-12-05'),
(197, 36, 17, 1, '2025-11-15'),
(198, 36, 13, 1, NULL),
(199, 36, 15, 1, '2030-05-01'),
(200, 36, 16, 1, '2025-12-15'),
(201, 36, 12, 1, '2025-11-14'),
(202, 36, 11, 1, '2025-12-05'),
(203, 37, 17, 1, '2025-11-15'),
(204, 37, 13, 1, NULL),
(205, 37, 15, 1, '2030-05-01'),
(206, 37, 16, 1, '2025-12-15'),
(207, 37, 12, 1, '2025-11-14'),
(208, 37, 11, 1, '2025-12-05'),
(209, 38, 17, 1, '2025-11-15'),
(210, 38, 13, 1, NULL),
(211, 38, 15, 1, '2030-05-01'),
(212, 38, 16, 1, '2025-12-15'),
(213, 38, 12, 1, '2025-11-14'),
(214, 38, 11, 1, '2025-11-27'),
(215, 7, 17, 1, '2025-11-15'),
(216, 7, 13, 1, NULL),
(217, 7, 15, 1, '2030-05-01'),
(218, 7, 16, 1, '2026-03-15'),
(219, 7, 12, 1, '2025-11-14'),
(220, 7, 11, 1, '2025-11-12'),
(221, 40, 17, 1, '2025-11-15'),
(222, 40, 13, 1, NULL),
(223, 40, 15, 1, '2030-05-01'),
(224, 40, 16, 1, '2025-12-15'),
(225, 40, 12, 1, '2025-11-14'),
(226, 40, 11, 1, '2025-11-27'),
(227, 41, 17, 1, '2025-11-15'),
(228, 41, 13, 1, NULL),
(229, 41, 15, 1, '2030-05-01'),
(230, 41, 16, 1, '2026-03-15'),
(231, 41, 12, 1, '2025-11-14'),
(232, 41, 11, 1, '2025-11-24'),
(233, 42, 17, 1, '2025-11-15'),
(234, 42, 13, 1, NULL),
(235, 42, 15, 1, '2030-05-01'),
(236, 42, 16, 1, '2026-03-15'),
(237, 42, 12, 1, '2025-11-14'),
(238, 42, 11, 1, '2026-02-10'),
(239, 24, 17, 1, '2025-11-15'),
(240, 24, 13, 1, NULL),
(241, 24, 15, 1, '2030-05-01'),
(242, 24, 16, 1, '2026-03-15'),
(243, 24, 12, 1, '2025-11-14'),
(245, 24, 11, 1, '2025-11-14'),
(246, 45, 17, 1, '2025-11-15'),
(247, 45, 13, 1, NULL),
(248, 45, 15, 1, '2030-05-01'),
(249, 45, 16, 1, '2025-12-15'),
(250, 45, 12, 1, '2025-11-14'),
(251, 45, 11, 1, '2025-12-25'),
(252, 25, 17, 1, '2025-11-15'),
(253, 25, 13, 1, NULL),
(254, 25, 15, 1, '2030-05-01'),
(255, 25, 16, 1, '2026-10-15'),
(256, 25, 12, 1, '2025-11-14'),
(257, 25, 11, 1, '2025-11-18'),
(258, 47, 17, 1, '2025-11-15'),
(259, 47, 13, 1, NULL),
(260, 47, 15, 1, NULL),
(261, 47, 16, 1, '2025-12-15'),
(262, 47, 12, 1, '2025-11-14'),
(263, 47, 11, 1, '2025-12-29'),
(264, 48, 17, 1, '2025-11-15'),
(265, 48, 13, 1, NULL),
(266, 48, 15, 1, NULL),
(267, 48, 16, 1, NULL),
(268, 48, 12, 1, NULL),
(269, 48, 11, 1, NULL),
(270, 49, 17, 1, '2025-11-15'),
(271, 49, 13, 1, NULL),
(272, 49, 15, 1, NULL),
(273, 49, 16, 1, NULL),
(274, 49, 12, 1, NULL),
(275, 49, 11, 1, NULL),
(276, 26, 17, 1, '2025-11-15'),
(277, 26, 13, 1, NULL),
(278, 26, 15, 1, NULL),
(279, 26, 16, 1, NULL),
(280, 26, 12, 1, NULL),
(281, 26, 11, 1, NULL),
(282, 27, 17, 1, '2025-11-15'),
(283, 27, 13, 1, NULL),
(284, 27, 15, 1, NULL),
(285, 27, 16, 1, NULL),
(286, 27, 12, 1, NULL),
(287, 27, 11, 1, NULL),
(288, 50, 17, 1, '2025-11-15'),
(289, 50, 13, 1, NULL),
(290, 50, 15, 1, NULL),
(291, 50, 16, 1, NULL),
(292, 50, 12, 1, NULL),
(293, 50, 11, 1, NULL),
(294, 51, 17, 1, '2025-11-15'),
(295, 51, 13, 1, NULL),
(296, 51, 15, 1, NULL),
(297, 51, 16, 1, NULL),
(298, 51, 12, 1, NULL),
(299, 51, 11, 1, NULL),
(300, 54, 17, 1, '2025-11-15'),
(301, 54, 13, 1, NULL),
(302, 54, 15, 1, '2030-05-01'),
(303, 54, 16, 1, '2026-06-13'),
(304, 54, 12, 1, '2025-11-14'),
(305, 54, 11, 1, '2026-06-05'),
(306, 34, 13, 1, NULL),
(307, 17, 17, 1, '2025-11-15'),
(309, 17, 16, 1, '2026-10-15'),
(310, 17, 14, 1, NULL),
(311, 17, 11, 1, '2026-07-04'),
(312, 28, 17, 1, '2025-11-15'),
(313, 28, 16, 1, NULL),
(314, 28, 14, 1, NULL),
(315, 28, 11, 1, NULL),
(316, 46, 17, 1, '2025-11-15'),
(317, 46, 16, 1, '2025-12-15'),
(318, 46, 14, 1, NULL),
(319, 46, 11, 1, '2025-12-09'),
(320, 44, 17, 1, '2025-11-15'),
(321, 44, 16, 1, '2025-12-15'),
(322, 44, 14, 1, NULL),
(323, 44, 11, 1, '2025-11-27'),
(324, 43, 17, 1, '2025-11-15'),
(325, 43, 16, 1, '2026-06-19'),
(326, 43, 14, 1, NULL),
(327, 43, 11, 1, '2025-12-16'),
(328, 39, 17, 1, '2025-11-15'),
(329, 39, 16, 1, '2026-05-14'),
(330, 39, 14, 1, NULL),
(331, 39, 11, 1, '2025-12-05'),
(332, 23, 17, 1, '2025-11-15'),
(334, 23, 14, 1, NULL),
(335, 23, 11, 1, '2025-12-09'),
(336, 23, 13, 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tajustes`
--
ALTER TABLE `tajustes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idArticulo` (`idArticulo`),
  ADD KEY `fk_emailUsuarioAjuste` (`email`);

--
-- Indices de la tabla `tarticulos`
--
ALTER TABLE `tarticulos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCategoria` (`idCategoria`);

--
-- Indices de la tabla `tbonos`
--
ALTER TABLE `tbonos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPersona` (`idPersona`);

--
-- Indices de la tabla `tcategorias`
--
ALTER TABLE `tcategorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tcentrosdecarga`
--
ALTER TABLE `tcentrosdecarga`
  ADD PRIMARY KEY (`idcentro`);

--
-- Indices de la tabla `tcompras_detalle`
--
ALTER TABLE `tcompras_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCompra` (`idCompra`),
  ADD KEY `idArticulo` (`idArticulo`);

--
-- Indices de la tabla `tcompras_encabezado`
--
ALTER TABLE `tcompras_encabezado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idProveedor` (`idProveedor`);

--
-- Indices de la tabla `tdocumentosvehiculo`
--
ALTER TABLE `tdocumentosvehiculo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idVehiculo` (`idVehiculo`);

--
-- Indices de la tabla `tempresas`
--
ALTER TABLE `tempresas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cuit` (`cuit`),
  ADD UNIQUE KEY `cuit_unique` (`cuit`);

--
-- Indices de la tabla `tobligacionesrol`
--
ALTER TABLE `tobligacionesrol`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idRol` (`idRol`);

--
-- Indices de la tabla `tobligacionesvehiculo`
--
ALTER TABLE `tobligacionesvehiculo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tpermisos`
--
ALTER TABLE `tpermisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tpermisos_detalle`
--
ALTER TABLE `tpermisos_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPermiso` (`idPermiso`);

--
-- Indices de la tabla `tpermisos_usuario_extra`
--
ALTER TABLE `tpermisos_usuario_extra`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`,`ruta`);

--
-- Indices de la tabla `tpersonas`
--
ALTER TABLE `tpersonas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `fk_persona_empresa` (`id_empresa`);

--
-- Indices de la tabla `tpersonasbonos`
--
ALTER TABLE `tpersonasbonos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPersona` (`idPersona`);

--
-- Indices de la tabla `tprocesos`
--
ALTER TABLE `tprocesos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tproveedores`
--
ALTER TABLE `tproveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `troles`
--
ALTER TABLE `troles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `trrhh`
--
ALTER TABLE `trrhh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPersona` (`idPersona`),
  ADD KEY `idRol` (`idRol`);

--
-- Indices de la tabla `tserviciosmonitoreables`
--
ALTER TABLE `tserviciosmonitoreables`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tserviciosvehiculo`
--
ALTER TABLE `tserviciosvehiculo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idVehiculo` (`idVehiculo`),
  ADD KEY `idArticulo` (`idArticulo`),
  ADD KEY `dniPersona` (`dniPersona`);

--
-- Indices de la tabla `tstock`
--
ALTER TABLE `tstock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idArticulo` (`idArticulo`),
  ADD KEY `idUbicacion` (`idUbicacion`);

--
-- Indices de la tabla `ttipocombustible`
--
ALTER TABLE `ttipocombustible`
  ADD PRIMARY KEY (`idtipo`);

--
-- Indices de la tabla `tubicaciones`
--
ALTER TABLE `tubicaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tuso`
--
ALTER TABLE `tuso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idVehiculo` (`idVehiculo`),
  ADD KEY `idPersona` (`idPersona`);

--
-- Indices de la tabla `tusuarios`
--
ALTER TABLE `tusuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `tvehiculos`
--
ALTER TABLE `tvehiculos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patente` (`patente`);

--
-- Indices de la tabla `tvencimientos`
--
ALTER TABLE `tvencimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPersona` (`idPersona`),
  ADD KEY `idObligacionRol` (`idObligacionRol`);

--
-- Indices de la tabla `tvencimientosvehiculos`
--
ALTER TABLE `tvencimientosvehiculos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vencveh_vehiculo` (`idVehiculo`),
  ADD KEY `fk_vencveh_obligacion` (`idObligacionVehiculo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tajustes`
--
ALTER TABLE `tajustes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT de la tabla `tarticulos`
--
ALTER TABLE `tarticulos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=463;

--
-- AUTO_INCREMENT de la tabla `tbonos`
--
ALTER TABLE `tbonos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tcategorias`
--
ALTER TABLE `tcategorias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `tcentrosdecarga`
--
ALTER TABLE `tcentrosdecarga`
  MODIFY `idcentro` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tcompras_detalle`
--
ALTER TABLE `tcompras_detalle`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT de la tabla `tcompras_encabezado`
--
ALTER TABLE `tcompras_encabezado`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `tdocumentosvehiculo`
--
ALTER TABLE `tdocumentosvehiculo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=579;

--
-- AUTO_INCREMENT de la tabla `tempresas`
--
ALTER TABLE `tempresas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tobligacionesrol`
--
ALTER TABLE `tobligacionesrol`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `tobligacionesvehiculo`
--
ALTER TABLE `tobligacionesvehiculo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `tpermisos`
--
ALTER TABLE `tpermisos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tpermisos_detalle`
--
ALTER TABLE `tpermisos_detalle`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT de la tabla `tpermisos_usuario_extra`
--
ALTER TABLE `tpermisos_usuario_extra`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `tpersonas`
--
ALTER TABLE `tpersonas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `tpersonasbonos`
--
ALTER TABLE `tpersonasbonos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;

--
-- AUTO_INCREMENT de la tabla `tprocesos`
--
ALTER TABLE `tprocesos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tproveedores`
--
ALTER TABLE `tproveedores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `troles`
--
ALTER TABLE `troles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `trrhh`
--
ALTER TABLE `trrhh`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `tserviciosmonitoreables`
--
ALTER TABLE `tserviciosmonitoreables`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tserviciosvehiculo`
--
ALTER TABLE `tserviciosvehiculo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `tstock`
--
ALTER TABLE `tstock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ttipocombustible`
--
ALTER TABLE `ttipocombustible`
  MODIFY `idtipo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tubicaciones`
--
ALTER TABLE `tubicaciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tuso`
--
ALTER TABLE `tuso`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `tusuarios`
--
ALTER TABLE `tusuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tvehiculos`
--
ALTER TABLE `tvehiculos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de la tabla `tvencimientos`
--
ALTER TABLE `tvencimientos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `tvencimientosvehiculos`
--
ALTER TABLE `tvencimientosvehiculos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=337;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tajustes`
--
ALTER TABLE `tajustes`
  ADD CONSTRAINT `fk_emailUsuarioAjuste` FOREIGN KEY (`email`) REFERENCES `tusuarios` (`email`),
  ADD CONSTRAINT `tajustes_ibfk_1` FOREIGN KEY (`idArticulo`) REFERENCES `tarticulos` (`id`);

--
-- Filtros para la tabla `tarticulos`
--
ALTER TABLE `tarticulos`
  ADD CONSTRAINT `TArticulos_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `tcategorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `tbonos`
--
ALTER TABLE `tbonos`
  ADD CONSTRAINT `tbonos_ibfk_1` FOREIGN KEY (`idPersona`) REFERENCES `tpersonas` (`id`);

--
-- Filtros para la tabla `tcompras_detalle`
--
ALTER TABLE `tcompras_detalle`
  ADD CONSTRAINT `tcompras_detalle_ibfk_1` FOREIGN KEY (`idCompra`) REFERENCES `tcompras_encabezado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tcompras_detalle_ibfk_2` FOREIGN KEY (`idArticulo`) REFERENCES `tarticulos` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `tcompras_encabezado`
--
ALTER TABLE `tcompras_encabezado`
  ADD CONSTRAINT `tcompras_encabezado_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `tproveedores` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `tdocumentosvehiculo`
--
ALTER TABLE `tdocumentosvehiculo`
  ADD CONSTRAINT `tdocumentosvehiculo_ibfk_1` FOREIGN KEY (`idVehiculo`) REFERENCES `tvehiculos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tobligacionesrol`
--
ALTER TABLE `tobligacionesrol`
  ADD CONSTRAINT `tobligacionesrol_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `troles` (`id`);

--
-- Filtros para la tabla `tpermisos_detalle`
--
ALTER TABLE `tpermisos_detalle`
  ADD CONSTRAINT `tpermisos_detalle_ibfk_1` FOREIGN KEY (`idPermiso`) REFERENCES `tpermisos` (`id`);

--
-- Filtros para la tabla `tpersonas`
--
ALTER TABLE `tpersonas`
  ADD CONSTRAINT `fk_persona_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `tempresas` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `tpersonasbonos`
--
ALTER TABLE `tpersonasbonos`
  ADD CONSTRAINT `tpersonasbonos_ibfk_1` FOREIGN KEY (`idPersona`) REFERENCES `tpersonas` (`id`);

--
-- Filtros para la tabla `trrhh`
--
ALTER TABLE `trrhh`
  ADD CONSTRAINT `TRRHH_ibfk_1` FOREIGN KEY (`idPersona`) REFERENCES `tpersonas` (`id`),
  ADD CONSTRAINT `TRRHH_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `troles` (`id`);

--
-- Filtros para la tabla `tserviciosvehiculo`
--
ALTER TABLE `tserviciosvehiculo`
  ADD CONSTRAINT `tserviciosvehiculo_ibfk_1` FOREIGN KEY (`idVehiculo`) REFERENCES `tvehiculos` (`id`),
  ADD CONSTRAINT `tserviciosvehiculo_ibfk_2` FOREIGN KEY (`idArticulo`) REFERENCES `tarticulos` (`id`),
  ADD CONSTRAINT `tserviciosvehiculo_ibfk_3` FOREIGN KEY (`dniPersona`) REFERENCES `tpersonas` (`dni`);

--
-- Filtros para la tabla `tstock`
--
ALTER TABLE `tstock`
  ADD CONSTRAINT `TStock_ibfk_1` FOREIGN KEY (`idArticulo`) REFERENCES `tarticulos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `TStock_ibfk_2` FOREIGN KEY (`idUbicacion`) REFERENCES `tubicaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tuso`
--
ALTER TABLE `tuso`
  ADD CONSTRAINT `tuso_ibfk_1` FOREIGN KEY (`idVehiculo`) REFERENCES `tvehiculos` (`id`),
  ADD CONSTRAINT `tuso_ibfk_2` FOREIGN KEY (`idPersona`) REFERENCES `tpersonas` (`id`);

--
-- Filtros para la tabla `tvencimientos`
--
ALTER TABLE `tvencimientos`
  ADD CONSTRAINT `tvencimientos_ibfk_1` FOREIGN KEY (`idPersona`) REFERENCES `tpersonas` (`id`),
  ADD CONSTRAINT `tvencimientos_ibfk_2` FOREIGN KEY (`idObligacionRol`) REFERENCES `tobligacionesrol` (`id`);

--
-- Filtros para la tabla `tvencimientosvehiculos`
--
ALTER TABLE `tvencimientosvehiculos`
  ADD CONSTRAINT `fk_vencveh_obligacion` FOREIGN KEY (`idObligacionVehiculo`) REFERENCES `tobligacionesvehiculo` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vencveh_vehiculo` FOREIGN KEY (`idVehiculo`) REFERENCES `tvehiculos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

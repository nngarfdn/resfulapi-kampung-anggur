-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 12, 2021 at 08:51 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kampunganggur`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggur`
--

CREATE TABLE `anggur` (
  `id` int(11) NOT NULL,
  `kode` text NOT NULL,
  `nama` text NOT NULL,
  `namailmiah` text NOT NULL,
  `description` longtext NOT NULL,
  `image` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `anggur`
--

INSERT INTO `anggur` (`id`, `kode`, `nama`, `namailmiah`, `description`, `image`, `createdAt`, `updatedAt`) VALUES
(1, '10001', 'Ninel', 'Vitis sp', 'Iklim Tumbuh : dataran rendah\nDataran yang cocok : Rendah - Tinggi\nAsal bibit : Okulasi / Stek Batang\nTinggi bibit : 20-30cm\nTempat tanam : Pot diameter &gt;60cm atau langsung ditanam di tanah\nMedia Tanam : Tanah : Humus\nPenyiraman : 1-2x Sehari\nPemupukan : 1 Bulan sekali\nUmur berbuah dari bibit : 3-5 tahun', '4e22f9c50e00972e685527af962e2c78.jpg', '2021-06-12 04:27:19', '2021-06-12 04:27:19');

-- --------------------------------------------------------

--
-- Table structure for table `toko`
--

CREATE TABLE `toko` (
  `id` int(11) NOT NULL,
  `kode` text NOT NULL,
  `namatoko` text NOT NULL,
  `kontak` text NOT NULL,
  `description` longtext NOT NULL,
  `image` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `toko`
--

INSERT INTO `toko` (`id`, `kode`, `namatoko`, `kontak`, `description`, `image`, `createdAt`, `updatedAt`) VALUES
(1, '20001', 'Rumah Anggur Pak Lanjar', '6281234567890', 'Menyediakan bibit anggur jenis ninel dan jupiter. sedia juga buah anggur, media tanam, dan pupuk. Ada juga olahan keripik anggur', 'a0ef5633559a44c5ea83a2d331f26527.jpg', '2021-06-12 06:46:29', '2021-06-12 06:46:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggur`
--
ALTER TABLE `anggur`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `toko`
--
ALTER TABLE `toko`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anggur`
--
ALTER TABLE `anggur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `toko`
--
ALTER TABLE `toko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

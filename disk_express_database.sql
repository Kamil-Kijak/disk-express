-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Cze 27, 2025 at 08:58 PM
-- Wersja serwera: 8.0.39
-- Wersja PHP: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `disk_express_database`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `emailcodes`
--

CREATE TABLE `emailcodes` (
  `ID` int NOT NULL,
  `Email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Code` varchar(21) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `files`
--

CREATE TABLE `files` (
  `ID` int NOT NULL,
  `SerialNumber` varchar(21) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ID_userOwner` int NOT NULL,
  `Path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Permision` enum('me','friends','link') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'me',
  `UploadDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `friends`
--

CREATE TABLE `friends` (
  `ID` int NOT NULL,
  `ID_user` int NOT NULL,
  `ID_userFriend` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `friendsrequests`
--

CREATE TABLE `friendsrequests` (
  `ID` int NOT NULL,
  `ID_userSender` int NOT NULL,
  `ID_userReceiver` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `securitycodes`
--

CREATE TABLE `securitycodes` (
  `ID` int NOT NULL,
  `UserEmail` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Code` varchar(21) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sociallinks`
--

CREATE TABLE `sociallinks` (
  `ID` int NOT NULL,
  `ID_user` int NOT NULL,
  `Name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Url` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `ID` int NOT NULL,
  `SerialNumber` varchar(21) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Password` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Username` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Surname` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Country` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ProfileImg` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `PricingPlan` enum('free','pro','ultimate') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'free',
  `DoubleVeryfication` tinyint(1) DEFAULT '0',
  `AutoLogin` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `emailcodes`
--
ALTER TABLE `emailcodes`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `SerialNumber` (`SerialNumber`),
  ADD KEY `ID_userOwner` (`ID_userOwner`);

--
-- Indeksy dla tabeli `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_user` (`ID_user`),
  ADD KEY `ID_userFriend` (`ID_userFriend`);

--
-- Indeksy dla tabeli `friendsrequests`
--
ALTER TABLE `friendsrequests`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_userSender` (`ID_userSender`),
  ADD KEY `ID_userReceiver` (`ID_userReceiver`);

--
-- Indeksy dla tabeli `securitycodes`
--
ALTER TABLE `securitycodes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserEmail` (`UserEmail`);

--
-- Indeksy dla tabeli `sociallinks`
--
ALTER TABLE `sociallinks`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_user` (`ID_user`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `SerialNumber` (`SerialNumber`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emailcodes`
--
ALTER TABLE `emailcodes`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friendsrequests`
--
ALTER TABLE `friendsrequests`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `securitycodes`
--
ALTER TABLE `securitycodes`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sociallinks`
--
ALTER TABLE `sociallinks`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`ID_userOwner`) REFERENCES `users` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`ID_userFriend`) REFERENCES `users` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `friendsrequests`
--
ALTER TABLE `friendsrequests`
  ADD CONSTRAINT `friendsrequests_ibfk_1` FOREIGN KEY (`ID_userSender`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendsrequests_ibfk_2` FOREIGN KEY (`ID_userReceiver`) REFERENCES `users` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `securitycodes`
--
ALTER TABLE `securitycodes`
  ADD CONSTRAINT `securitycodes_ibfk_1` FOREIGN KEY (`UserEmail`) REFERENCES `users` (`Email`) ON DELETE CASCADE;

--
-- Constraints for table `sociallinks`
--
ALTER TABLE `sociallinks`
  ADD CONSTRAINT `sociallinks_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `users` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

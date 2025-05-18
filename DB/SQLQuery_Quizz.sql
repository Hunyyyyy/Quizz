-- Tạo cơ sở dữ liệu (kiểm tra nếu chưa tồn tại)
IF DB_ID('quiz_app') IS NULL
    CREATE DATABASE quiz_app;
GO

USE quiz_app;
GO

-- Tạo bảng User
CREATE TABLE [User] (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
GO

-- Tạo bảng Question
CREATE TABLE Question (
    question_id INT PRIMARY KEY IDENTITY(1,1),
    question_text TEXT NOT NULL,
    correct_answer INT NOT NULL -- Lưu answer_id của đáp án đúng
);
GO

-- Tạo bảng Answer
CREATE TABLE Answer (
    answer_id INT PRIMARY KEY IDENTITY(1,1),
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BIT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE CASCADE
);
GO

-- Tạo bảng Quiz
CREATE TABLE Quiz (
    quiz_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    total_time INT, -- Tính bằng giây
    correct_answers INT DEFAULT 0, -- Số câu trả lời đúng
    result VARCHAR(10), -- "Pass" hoặc "Fail"
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Tạo bảng User_Answer
CREATE TABLE User_Answer (
    user_answer_id INT PRIMARY KEY IDENTITY(1,1),
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_id INT NOT NULL,
    is_correct BIT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(question_id) ON DELETE NO ACTION,
    FOREIGN KEY (answer_id) REFERENCES Answer(answer_id) ON DELETE NO ACTION
);
ALTER TABLE [User]
ALTER COLUMN username NVARCHAR(50) NOT NULL;
ALTER TABLE Question
ALTER COLUMN question_text NVARCHAR(MAX) NOT NULL;
ALTER TABLE Answer
ALTER COLUMN answer_text NVARCHAR(MAX) NOT NULL;
ALTER TABLE Quiz
ALTER COLUMN result NVARCHAR(10);
GO
INSERT INTO [User] (username, email) VALUES
(N'Huy', N'Huy@example.com'),
(N'Thành', N'Thanh@example.com'),
(N'An', N'An@example.com'),
(N'Phúc', N'Phuc@example.com'),
(N'Đạt', N'Dat@example.com');

INSERT INTO Question (question_text, correct_answer) VALUES
(N'1 + 1 bằng mấy?', 1),
(N'Thủ đô Việt Nam là gì?', 6),
(N'Màu nào có trong cờ Việt Nam?', 10),
(N'Ngôn ngữ lập trình nào phổ biến nhất?', 14),
(N'SQL là viết tắt của?', 17);
INSERT INTO Answer (question_id, answer_text, is_correct) VALUES
(1, '2', 1),  
(1, '3', 0),
(1, '4', 0),
(1, '5', 0),

(2, N'TP.HCM', 0),
(2, N'Hà Nội', 1),  
(2, N'Đà Nẵng', 0),
(2, N'Huế', 0),


(3, N'Xanh', 0),
(3, N'Đỏ', 1), 
(3, N'Vàng', 0),
(3, N'Trắng', 0),

-- Câu 4 (question_id = 4)
(4, 'Python', 0),
(4, 'JavaScript', 1), -- answer_id = 14
(4, 'PHP', 0),
(4, 'C++', 0),

-- Câu 5 (question_id = 5)
(5, 'Structured Query Language', 1), -- answer_id = 17
(5, 'Simple Query Line', 0),
(5, 'System Quick Link', 0),
(5, 'Server Query Load', 0);
INSERT INTO Quiz (user_id, start_time, end_time, total_time, correct_answers, result) VALUES
(1, GETDATE(), DATEADD(MINUTE, 5, GETDATE()), 300, 3, 'Pass'),
(2, GETDATE(), DATEADD(MINUTE, 6, GETDATE()), 360, 2, 'Fail'),
(3, GETDATE(), DATEADD(MINUTE, 4, GETDATE()), 240, 4, 'Pass'),
(4, GETDATE(), DATEADD(MINUTE, 7, GETDATE()), 420, 1, 'Fail'),
(5, GETDATE(), DATEADD(MINUTE, 5, GETDATE()), 300, 3, 'Pass');
-- Quiz 1 (user_id = 1)
INSERT INTO User_Answer (quiz_id, question_id, answer_id, is_correct) VALUES
(1, 1, 1, 1),
(1, 2, 5, 0),
(1, 3, 10, 1),
(1, 4, 14, 1),
(1, 5, 18, 0);

-- Quiz 2 (user_id = 2)
INSERT INTO User_Answer (quiz_id, question_id, answer_id, is_correct) VALUES
(2, 1, 2, 0),
(2, 2, 6, 1),
(2, 3, 9, 0),
(2, 4, 13, 0),
(2, 5, 17, 1);

-- Quiz 3 (user_id = 3)
INSERT INTO User_Answer (quiz_id, question_id, answer_id, is_correct) VALUES
(3, 1, 1, 1),
(3, 2, 6, 1),
(3, 3, 10, 1),
(3, 4, 14, 1),
(3, 5, 17, 1);

-- Quiz 4 (user_id = 4)
INSERT INTO User_Answer (quiz_id, question_id, answer_id, is_correct) VALUES
(4, 1, 2, 0),
(4, 2, 7, 0),
(4, 3, 9, 0),
(4, 4, 13, 0),
(4, 5, 18, 0);

-- Quiz 5 (user_id = 5)
INSERT INTO User_Answer (quiz_id, question_id, answer_id, is_correct) VALUES
(5, 1, 1, 1),
(5, 2, 6, 1),
(5, 3, 9, 0),
(5, 4, 14, 1),
(5, 5, 18, 0);

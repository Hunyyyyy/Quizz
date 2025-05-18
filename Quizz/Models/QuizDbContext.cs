using Microsoft.EntityFrameworkCore;

namespace Quizz.Models
{
    public class QuizDbContext : DbContext
    {
        public DbSet<User> User { get; set; }
        public DbSet<Question> Question { get; set; }
        public DbSet<Answer> Answer { get; set; }
        public DbSet<Quiz> Quiz { get; set; }
        public DbSet<UserAnswer> User_Answer { get; set; }

        public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Bảng User
            modelBuilder.Entity<User>()
                .HasKey(u => u.user_id);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Quiz)
                .WithOne(q => q.User)
                .HasForeignKey(q => q.user_id)
                .OnDelete(DeleteBehavior.Cascade);

            // Bảng Question
            modelBuilder.Entity<Question>()
                .HasKey(q => q.question_id);

            modelBuilder.Entity<Question>()
                .HasMany(q => q.Answer)
                .WithOne(a => a.Question)
                .HasForeignKey(a => a.question_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Question>()
                .HasMany(q => q.UserAnswer)
                .WithOne(ua => ua.Question)
                .HasForeignKey(ua => ua.question_id)
                .OnDelete(DeleteBehavior.NoAction);

            // Bảng Answer
            modelBuilder.Entity<Answer>()
                .HasKey(a => a.answer_id);

            modelBuilder.Entity<Answer>()
                .HasMany(a => a.UserAnswers)
                .WithOne(ua => ua.Answer)
                .HasForeignKey(ua => ua.answer_id)
                .OnDelete(DeleteBehavior.NoAction);

            // Bảng Quiz
            modelBuilder.Entity<Quiz>()
                .HasKey(q => q.quiz_id);

            modelBuilder.Entity<Quiz>()
                .HasMany(q => q.UserAnswers)
                .WithOne(ua => ua.Quiz)
                .HasForeignKey(ua => ua.quiz_id)
                .OnDelete(DeleteBehavior.Cascade);

            // Bảng UserAnswer
            modelBuilder.Entity<UserAnswer>()
                .HasKey(ua => ua.user_answer_id);
        }
    }
}

﻿// <auto-generated />
using Backend;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Backend_Models.Models.Ingredient", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ProductId");

                    b.ToTable("Ingredients");
                });

            modelBuilder.Entity("Backend_Models.Models.IngredientAttribute", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("DriesSkin")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("EyeIrritant")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("Hydrating")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("NonComedogenic")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("ReducesRedness")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("SafeForPregnancy")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Usage")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Name");

                    b.ToTable("IngredientAttributes");
                });

            modelBuilder.Entity("Backend_Models.Models.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte[]>("Image")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("ENUM('MOISTURIZER','CLEANSER','SERUM','SUNSCREEN')");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("Backend_Models.Models.Ingredient", b =>
                {
                    b.HasOne("Backend_Models.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");
                });
#pragma warning restore 612, 618
        }
    }
}

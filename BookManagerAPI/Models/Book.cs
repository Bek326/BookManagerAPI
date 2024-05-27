namespace BookManagerAPI.Models;

public class Book
{
    public int Id { get; init; }
    public string? Title { get; init; }
    public string? Author { get; init; }
    public int Year { get; init; }
    public string? Genre { get; init; }
}
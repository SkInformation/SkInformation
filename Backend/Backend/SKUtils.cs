namespace Backend;

public class SKUtils
{
    public static string ToString(string passwordFilePath)
    {
        if (File.Exists(passwordFilePath))
        {
            return File.ReadAllText(passwordFilePath);
        }

        return "";
    }
}
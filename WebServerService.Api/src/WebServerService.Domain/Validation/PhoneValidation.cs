using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace WebServerService.Domain.Validation
{
    public class PhoneNumberAttribute : ValidationAttribute
    {
        private static readonly Regex PhoneNumberRegex = new Regex(@"^\+?[0-9]\d{1,14}$", RegexOptions.Compiled);

        public override bool IsValid(object value)
        {
            if (value == null)
            {
                return true; // Not the responsibility of this attribute to check for required fields
            }

            var phoneNumber = value as string;
            return phoneNumber != null && PhoneNumberRegex.IsMatch(phoneNumber);
        }

        public override string FormatErrorMessage(string phone)
        {
            return $"{phone} is not a valid phone number.";
        }
    }
}

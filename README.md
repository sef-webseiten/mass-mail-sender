# mass-mail-sender

> Easily sending mails to lots of clients at once from excel sheets

## Usage

The following command illustrates the usage: 

```node -r esm index.js -s emails.xlsx -m mail.txt```

You have to set the `-s` or `--sheet` parameter to the path of the excel sheet and the `-m` or `--mail` parameter to the path of the mail file. 

The mail file should have the subject of the mail in the first line and the html content in the second. 
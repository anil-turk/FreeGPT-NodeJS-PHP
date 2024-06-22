# FreeGPT-NodeJS-PHP

This project is a Node.js application that interacts with a PHP site to fetch prompts, send them to a GPT 3.5 model that provides freely without login, and then send the responses back to the PHP site.

## Warning
This project is not affiliated with ChatGPT in any kind. I'm not responsible for anything and this project is just for educational purposes ONLY.
If you want to use example.php with sql please do not forget to put mysqli_real_escape_string to inputs for your own safety.

## Dependencies

This project uses the following dependencies:

- axios: "^1.6.8"
- [puppeteer-real-browser](https://github.com/zfcsoftware/puppeteer-real-browser): "^1.2.18"

You can install these dependencies using npm:

```bash
npm install
```

## Usage

The main script of this project is `gpt_node.js`. This script fetches prompts from a PHP site, sends them to a GPT model, and then sends the responses back to the PHP site.

Before running the script, you need to set the following variables:

- `site`: The URL of your PHP site where you get the prompt data and send the response.
- `userpass`: If you have password directory protection, add the username and password here (end with @). The format is `username:password@`.
- `useproxy`: If you want to use a proxy, set it to true.

You can run the script using the following command:

```bash
node gpt_node.js
```

## Functions

- `main()`: This is the main function of the script. It fetches prompts from the PHP site, sends them to the GPT model, and then sends the responses back to the PHP site.
- `gpt.ask(query, pageNumber)`: This function sends a query to the GPT model and returns the response.
- `extractJSONObject(inputString)`: This function extracts a JSON object from a string.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you want to use client-side you can visit [this project.](https://github.com/ashishagarwal2023/freegpt.js.org)

## License

[MIT](https://choosealicense.com/licenses/mit/)

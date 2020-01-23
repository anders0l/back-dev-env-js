export default require('minimist')(process.argv.slice(2))['MY_POD_NAME'] || process.env.MY_POD_NAME || '';

![image](https://github.com/user-attachments/assets/3b8d625f-f3f1-4f4b-8a2d-80a061b8c383)

<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/owolabioromidayo/ojami">
    <img src="https://github.com/user-attachments/assets/767629d6-d8e3-4d2b-8c04-885008afce29" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ọjà mi</h3>

  <p align="center">
    A new shopping experience powered by Kora
    <br />
    <a href="https://github.com/owolabioromidayo/ojami"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.ojami.shop">View Demo</a>
    ·
    <a href="https://github.com/owolabioromidayo/ojami/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/owolabioromidayo/ojami/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Many small businesses across Africa lack an efficient digital presence to showcase their products and services. They often rely on traditional methods such as physical storefronts or basic social media accounts, which limits their market reach and scalability. Without access to integrated e-commerce tools, these businesses miss out on opportunities to engage a broader audience, track inventory efficiently, and accept seamless digital payments.

Additionally, physical businesses, such as resorts, arcades, restaurants, and local retail stores, often face challenges in offering flexible, contactless payment options. While many businesses use methods like POS systems or bank transfers, they struggle with tracking, managing, and labeling these payments effectively. This leads to inefficiencies, missed opportunities for improving customer satisfaction, and difficulty building loyalty among modern, tech-savvy consumers.

We have created a solution to address these challenges. Our platform, ọjà mi, empowers small businesses to establish a strong online presence, manage their inventory efficiently, and accept seamless digital payments. By leveraging our platform, businesses can:

- Showcase their products and services to a broader audience
- Track inventory and manage sales efficiently
- Accept seamless digital payments from customers
- Offer flexible, contactless payment options to customers
- Track, manage, and label payments effectively
- An innovative offline payment system
- Improve customer experience using shopping assistants and augmented reality

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

We were able to build this project using the following technologies:

<p align="left">
<img src="https://img.shields.io/badge/-JavaScript-black?style=flat-square&logo=javascript"/>
<img src ="https://img.shields.io/badge/-Typescript-black?style=flat-square&logo=typescript" />
<img src="https://img.shields.io/badge/-Python-black?style=flat-square&logo=python"/>
<img src="https://img.shields.io/badge/-Nodejs-black?style=flat-square&logo=Node.js"/>
<img src="https://img.shields.io/badge/-Nextjs-black?style=flat-square&logo=Next.js"/>
<img src="https://img.shields.io/badge/-React-black?style=flat-square&logo=react"/>
<img src="https://img.shields.io/badge/-PostgreSQL-black?style=flat-square&logo=postgresql"/>
<img src= "https://img.shields.io/badge/-ChakraUI-black?style=flat-square&logo=chakra-ui"/>
<img src="https://img.shields.io/badge/-Tailwindcss-black?style=flat-square&logo=tailwindcss"/>
 <img src="https://img.shields.io/badge/-Git-black?style=flat-square&logo=git"/>
 <img src="https://img.shields.io/badge/-GitHub-black?style=flat-square&logo=github"/>
 <img src="https://img.shields.io/badge/-Linux-black?style=flat-square&logo=linux"/>
 <img src="https://img.shields.io/badge/-Ubuntu-black?style=flat-square&logo=ubuntu"/>
  <img src="https://img.shields.io/badge/-Vercel-black?style=flat-square&logo=vercel"/>

</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

### Installation

_You can install the dependencies using npm, yarn, pnpm, or bun. You will need to have API Keys from OpenAI and Korapay to run the project._

1. Get a test API Keys at [https://developers.korapay.com](https://developers.korapay.com)
2. Clone the repo
   ```sh
   git clone https://github.com/owolabioromidayo/ojami.git
   ```
3. Install dependencies

- npm

  ```sh
  npm install
  ```

- yarn

  ```sh
  yarn install
  ```

- pnpm

  ```sh
  pnpm install
  ```

- bun
  ```sh
  bun install
  ```

4. Setup your postgres database and update the .env file with your credentials
5. Setup redis-server and update the .env file with your credentials
6. See the [open issues](https://github.com/owolabioromidayo/ojami/issues) for a full list of proposed features (and known issues).

The project is separated into two main parts, the frontend and the backend.

### Starting up the frontend

#### /client

1. Run the development server
   ```sh
   npm run dev
   ```

### Starting up the backend

#### /node-server

1. Run the development server
   ```sh
   npm start
   ```



## Project Structure
```
ojami/
├── node-server/        # Node.js backend for API and integration with Kora and AI Models
│   └── src/
│       └── index.ts
│       └── mikro-orm.config.ts
│       └── entities/      # Database entities
│       └── migrations/     # Database migrations
│       └── routes/     # API routes
│       └── types.ts     # Type definitions
│       └── utils/     # Utility functions
│       └── middleware/     # Middleware
│   └── .env     # Environment variables
│
├── client/       # Next.js frontend for the application
│   └── lib/
│       └── src/
│           └── pages/    # App pages
│           └── components/    # Reusable UI components
│           └── lib/    
│           └── utils/     
│           └── styles/     # Global styles
│
│
└── README.md
```



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Screenshots
![image](https://github.com/user-attachments/assets/5a72aa84-7e14-4389-a9aa-140c5905d70f)

![image](https://github.com/user-attachments/assets/f53318d4-58f7-4269-a8d9-8b6fb6d1b4d6)



<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/owolabioromidayo/ojami/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=owolabioromidayo/ojami" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->



[contributors-shield]: https://img.shields.io/github/contributors/owolabioromidayo/ojami?style=for-the-badge
[contributors-url]: https://github.com/owolabioromidayo/ojami/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/owolabioromidayo/ojami?style=for-the-badge
[forks-url]: https://github.com/owolabioromidayo/ojami/network/members
[stars-shield]: https://img.shields.io/github/stars/owolabioromidayo/ojami?style=for-the-badge
[stars-url]: https://github.com/owolabioromidayo/ojami/stargazers
[issues-shield]: https://img.shields.io/github/issues/owolabioromidayo/ojami?style=for-the-badge
[issues-url]: https://github.com/owolabioromidayo/ojami/issues
[license-shield]: https://img.shields.io/github/license/owolabioromidayo/ojami?style=for-the-badge
[license-url]: https://github.com/owolabioromidayo/ojami/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-35495E?style=for-the-badge&logo=node.js&logoColor=4FC08D
[Node-url]: https://nodejs.org/en
[Chakra]: https://img.shields.io/badge/Chakra-ui-DD0031?style=for-the-badge&logo=chakra-ui&logoColor=white
[Chakra-url]: https://chakra-ui.com/

# 🧭 who-am-i

**This is my journey** — a personal project by [Valentin Guevara](https://github.com/ValentinGuevara) that encapsulates a multifaceted infrastructure-as-code (IaC) and serverless web application stack.

https://who-am-i-psi.vercel.app/

---

## 🚀 Project Overview

The `who-am-i` repository is a comprehensive monorepo that integrates:

- **Infrastructure as Code (IaC):**
  - Utilizes Terraform for provisioning and managing cloud resources.
- **Serverless Functions:**
  - AWS Lambda functions, such as `insert-place`, to handle backend logic.
- **Web Application:**
  - A frontend application built with modern web technologies.

This project serves as a sandbox for exploring best practices in DevOps, backend development, and frontend engineering.

---

## 🚦 Build Status

![Terraform Deploy Status](https://github.com/ValentinGuevara/who-am-i/actions/workflows/terraform.yaml/badge.svg?branch=main)

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/who-am-i-psi?name=Who+Am+I)

---

## 🗂️ Repository Structure

```
.
├── .github/workflows/       # CI/CD pipelines
├── iac/                     # Terraform configurations
├── lambdas/
│   ├── insert-place/        # AWS Lambda function code
│   └── get-places/          # AWS Lambda function code
├── webapp/                  # Frontend application source
├── build_lambda.sh          # Script to package Lambda functions
└── README.md                # Project documentation
```

---

## ⚙️ Technologies Used

- **Infrastructure:**
  - Terraform
  - AWS (Lambda, API Gateway, DynamoDB, IAM, etc.)
  - Vercel for next app w/ server actions
- **Backend:**
  - Node.js 22
  - TypeScript
- **Frontend:**
  - React
  - TypeScript
  - Next 15
  - Tailwind
  - Shadcdn UI
- **CI/CD:**
  - GitHub Actions
- **Google Services**
  - Bot Captcha detection
  - Google Maps Places API

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Terraform](https://www.terraform.io/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [pnpm](https://pnpm.io/) (preferred package manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ValentinGuevara/who-am-i.git
   cd who-am-i
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up AWS credentials:**

   Ensure your AWS credentials are configured properly for Terraform and AWS CLI to function.

### Deployment

1. **Provision infrastructure with Terraform:**

   ```bash
   cd iac
   terraform init
   terraform apply
   ```

2. **Build and deploy Lambda functions:**

   ```bash
   ./build_lambda.sh
   ```

3. **Start the frontend application:**

   ```bash
   cd webapp
   pnpm dev
   ```

---

## 📌 Notes and Best Practices later

- **Security:**
  - Ensure least privilege principles are followed when assigning IAM roles.
- **Caching:**
  - Implement caching strategies to optimize performance.
- **CI/CD:**
  - Leverage GitHub Actions for automated testing and deployment.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Special thanks to all contributors and the open-source community for their invaluable resources and support.

---

Feel free to explore, contribute, and reach out with any questions or suggestions!

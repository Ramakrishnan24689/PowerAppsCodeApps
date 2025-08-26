# 🚀 Power Apps Code Apps (Early Access Preview) 

> ⚡ **Quick start** 
>
> - [Start in minutes with a Hello World sample code](samples/HelloWorld/README.md) - A ready to run React sample, with minimum setps to run on Power Apps.
> 
> 📂 **Samples**
>
> - [Hello World](samples/HelloWorld/) - Basic React sample to get started quickly
> - [Static Asset Tracker](samples/StaticAssetTracker/) - Asset management with static data.
> - [Static Sample / Template](samples/FluentSample/README.md) - A static App with navigation, build with GitHub Copilot using Fluent UI. Samples includes prompt samples and guide to connect with real data. Includes:
>   - Office 365
>   - SQL using data pagination
>   - Custom Connector
>
> 📚 **How to**
>
> - [How to create an app from Scratch](docs/how-to-create-from-scratch.md) - A detailed walkthrough to turn a blank app created with vite into Power Apps code app.
> - [How to connect to data](docs/how-to-connect-to-data.md) - Code apps enable connecting to Power Platform connectors. To do this, you will create connections, add them to the app, and update the app to call them.
> - [How to connect to Azure SQL](docs/how-to-connect-to-azure-sql.md) - Find a detailed walkthrough for connecting your code app to Azure SQL.
> - [How to analyze data requests/response](docs/how-to-analyze-data-request-response.md) - Troubleshoot API calls
> - [How to create sample api and a custom connector](docs/how-to-create-api-and-custom-connector.md) - Quickly create a mock api and a custom connector to test Code Apps with Custom Connectors.

> - [How to connect to Dataverse](docs/how-to-connect-to-dataverse.md) - Step-by-step guide to connect your code app to Microsoft Dataverse using the Power Apps SDK.
>
>   **Feedback**
>   - Email: paCodeAppPreview@microsoft.com

Power Apps empowers developers of all skillsets—including those building web apps in IDEs like Visual Studio Code—to efficiently build and run business apps on a managed platform.

**Code Apps** is a new way for developers to bring Power Apps capabilities into web apps built in a code-first IDE. These capabilities are available both during local development and when an app runs in Power Platform.

**Key features include:**

- Out-of-the-box Microsoft Entra authentication and authorization
- Access to 1,500+ Power Platform connectors, callable directly from JavaScript
- Easy publishing and hosting of line-of-business web apps in Power Platform
- Adherence to your organization’s Managed Platform policies (app sharing limits, Conditional Access, Data Loss Prevention, etc.)

The managed platform accelerates innovation in safe environments. When ready, apps can be deployed to dedicated production environments. Code Apps and the managed platform reinforce safe, rapid innovation, and, when ready, these apps can be deployed to dedicated production environments.

# 📑 Table of Contents 

- [What are code apps?](#what-are-code-apps-)
- [Prerequisites](#prerequisites-)
  - [Install the following developer tools](#install-the-following-developer-tools)
  - [Enable code apps on a Power Platform environment](#enable-code-apps-on-a-power-platform-environment)
  - [License end-users with Power Apps Premium](#license-end-users-with-power-apps-premium)
- [Limitations](#limitations)
- [See also](#see-also)
- [Preview disclaimer](#preview-disclaimer)
- [License](#license-)
- [Code of Conduct](#code-of-conduct)

# ✨ What are code apps? 
Power Apps aims to empower developers of all skillsets, including developers building web apps in IDEs like Visual Studio Code, to efficiently build and run business apps in a managed platform. Code apps is a new way for developers to bring Power Apps capabilities in web apps they’re building in an code first IDE. These capabilities are available during local development and when an app runs in Power Platform. Power Apps capabilities available to code apps includes out-of-box Microsoft Entra authentication and authorization, access to 1,500+ Power Platform connectors which can be called directly from JavaScript. Code apps make it so any developer with a command line can publish and host their line of business app in Power Platform. Also, code apps respect your organization’s Managed Platform policies like app sharing limits, Conditional access policies and Data Loss Prevention. Code apps and the managed platform reinforces accelerated innovation in safe places and, when ready, these apps can be deployed to dedicated production environments.

Code apps allow developers to write custom code (React, Angular, Vue, etc.) that runs seamlessly within Power Platform, which gives you:
- **Full control over your UI and logic** 💻
- **Access to Power Platform data sources** 📊
- **Enterprise-grade authentication** 🔐
- **Simplified deployment and ALM** 🔄

# 📋 Prerequisites 

Code apps require several developer tools like Visual Studio Code, git, dotnet, node.js, and npm to be available on the command line.  

## Install the following developer tools

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- [Power Apps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

## Enable code apps on a Power Platform environment
Code apps can be enabled via environment setting which can be set by Power Platform Admins and environment admins. The environment setting respects groups and rules set by Power Platform Admins. 
1. As an admin, go to https://admin.powerplatform.microsoft.com
2. Navigate to Manage > Environments > select the environment where you will use code apps
3. Navigate to Settings >  Expand the Product subsection > Select Features
4. Navigate to the feature "Power Apps Code Apps" and use the "Enable code apps" toggle for enablement.
5. Click "Save" in the settings experience.  

<img width="1022" height="369" alt="image" src="https://github.com/user-attachments/assets/a215b7fe-acf4-4082-b7a7-2a7995970a9a" />


>[!NOTE]
> If the Power Apps Code Apps setting doesn't appear in the admin center UI it is because a UI update hasn't reached your environment yet. You can get the setting to appear by appending a query string to the admin center URI.
>E.g.
><pre>
>https://admin.powerplatform.microsoft.com/manage/environments/1c137ea4-049e-ef11-8a66-000d3a106833/settings/Features
> to
>https://admin.powerplatform.microsoft.com/manage/environments/1c137ea4-049e-ef11-8a66-000d3a106833/settings/Features<b>?ecs.ShowCodeAppSetting=true</b>
></pre>

<img width="1031" height="332" alt="image" src="https://github.com/user-attachments/assets/45d3f1d9-56e3-41e9-82cc-4d8fbb30bb79" />


## License end-users with Power Apps Premium

End-users that run code apps will need a [Power Apps Premium license](https://www.microsoft.com/power-platform/products/power-apps/pricing).

# 🚧 Limitations 

1. Code apps can invoke APIs outside of Power Platform connectors. Code apps do not support [Content Security Policy](https://learn.microsoft.com/power-platform/admin/content-security-policy) (CSP), yet.
2. Code apps do not support [Storage Shared Access Signature (SAS) IP restriction](https://learn.microsoft.com/power-platform/admin/security/data-storage#advanced-security-features ), yet.
3. Code apps don’t support Power Platform Native source code integration.
4. Code apps don’t support Dataverse solutions and therefore cannot use Power Platform pipelines for deployments.
5. Code apps don’t have a Power Platform native integration with Azure Application Insights. Azure Application Insights can be added as it would be to a generic web app but it will not include information recognized in the platform layer, such as app open events (to measure success/failure)

# 🔗 See also
1. [Limits and config](./docs/limits-and-config.md)
2. [Supported Managed Platform capabilities](./docs/managed-platform-support.md)

# ⚠️ Preview disclaimer

Preview features are features that aren’t complete but are made available on a “preview” basis so customers can get early access and provide feedback. Preview features are not supported by Microsoft Support, may have limited or restricted functionality, aren’t meant for production use, and may be available only in selected geographic areas.

Preview features are features that aren’t complete but are made available on a “preview” basis so customers can get early access and provide feedback. Preview features are not supported by Microsoft Support, may have limited or restricted functionality, aren’t meant for production use, and may be available only in selected geographic areas.  

# 📄 License 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# 🤝 Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

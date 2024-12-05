## Next.js App Router



* 当使用括号 创建新文件夹时()，名称不会包含在 URL 路径中。因此/dashboard/(overview)/page.tsx变成/dashboard。

需要了解：在 HTML 中，您需要将 URL 传递给action属性。此 URL 将是提交表单数据的目的地（通常是 API 端点）。

然而，在 React 中，该action属性被视为一种特殊的 prop - 这意味着 React 在其之上构建以允许调用操作。

在后台，服务器操作会创建一个POSTAPI 端点。这就是为什么您在使用服务器操作时不需要手动创建 API 端点的原因。
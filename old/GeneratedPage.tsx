import { Page, Layout, Button, Text, Inline, Box } from "@shopify/polaris";
import { ChevronLeftIcon, ChevronRightIcon } from "@shopify/polaris-icons";

export default function GeneratedPage() {
  return (
    <Page title="Generated Page">
      <Layout>
        <Layout.Section>
          <Inline align="space-between">
            <Box>{/* Switcher component placeholder */}</Box>
            <Button variant="primary">Create new</Button>
          </Inline>
        </Layout.Section>
        <Layout.Section>
          <Box>{/* Content area */}</Box>
        </Layout.Section>
        <Layout.Section>
          <Inline align="center" gap="200">
            <Button variant="tertiary" icon={ChevronLeftIcon} />
            <Text>1-10 of 12</Text>
            <Button variant="tertiary" icon={ChevronRightIcon} />
          </Inline>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

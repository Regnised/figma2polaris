import React, { useState, useCallback } from 'react';
import {
  Page,
  Card,
  LegacyCard,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  IndexFiltersMode,
  Text,
  Badge,
  Button,
  Icon,
  InlineStack,
  BlockStack,
  InlineGrid,
  Pagination,
  Link,
  Tooltip,
} from '@shopify/polaris';
import {
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InfoIcon,
} from '@shopify/polaris-icons';

type Trend = { direction: 'up' | 'down'; percent: number; tone: 'success' | 'critical' };

type Metric = {
  label: string;
  value: string;
  trend: Trend;
  total: string;
  extra?: React.ReactNode;
  tooltip: string;
};

const METRICS: Metric[] = [
  {
    label: 'Workflows run',
    value: '10',
    trend: { direction: 'up', percent: 30, tone: 'success' },
    total: '(320)',
    tooltip: 'Total workflow executions in the selected period.',
  },
  {
    label: 'Actions executed',
    value: '242',
    trend: { direction: 'down', percent: 30, tone: 'critical' },
    total: '(320)',
    tooltip: 'Total actions that ran successfully.',
  },
  {
    label: 'Actions failed',
    value: '10',
    trend: { direction: 'up', percent: 100, tone: 'critical' },
    total: '(320)',
    extra: <Link url="#reasons" removeUnderline>Reasons</Link>,
    tooltip: 'Actions that failed during execution.',
  },
];

type RunItem = {
  id: string;
  name: string;
  startedAt: string;
  action: string;
  status: 'published';
};

const RUNS: RunItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  name: 'Workflow1',
  startedAt: 'Starts yesterday at 9:01 am',
  action: 'Capture payment',
  status: 'published' as const,
}));

function TrendIndicator({ trend }: { trend: Trend }) {
  return (
    <InlineStack gap="050" blockAlign="center">
      <span style={{ display: 'inline-flex', color: trend.tone === 'success' ? 'var(--p-color-text-success)' : 'var(--p-color-text-critical)' }}>
        <Icon
          source={trend.direction === 'up' ? ArrowUpIcon : ArrowDownIcon}
          tone={trend.tone}
        />
      </span>
      <Text as="span" variant="bodyMd" tone={trend.tone}>
        {trend.percent}%
      </Text>
    </InlineStack>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between" blockAlign="center" wrap={false}>
          <Text as="h3" variant="headingSm" fontWeight="semibold">
            {metric.label}
          </Text>
          <Tooltip content={metric.tooltip}>
            <span style={{ display: 'inline-flex', color: 'var(--p-color-text-subdued)' }}>
              <Icon source={InfoIcon} tone="subdued" />
            </span>
          </Tooltip>
        </InlineStack>
        <InlineStack gap="200" blockAlign="center" wrap={false}>
          <Text as="p" variant="heading2xl" fontWeight="regular">
            {metric.value}
          </Text>
          <TrendIndicator trend={metric.trend} />
          <Text as="span" variant="bodyMd" tone="subdued">
            {metric.total}
          </Text>
        </InlineStack>
        {metric.extra ? <div>{metric.extra}</div> : null}
      </BlockStack>
    </Card>
  );
}

export default function ActivityPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [workflowFilter, setWorkflowFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Default);

  const resourceName = { singular: 'run', plural: 'runs' };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(RUNS);

  const tabs = [
    {
      content: 'All',
      index: 0,
      onAction: useCallback(() => setSelectedTab(0), []),
      id: 'all-tab',
      isLocked: true,
    },
    {
      content: 'Completed with actions',
      index: 1,
      onAction: useCallback(() => setSelectedTab(1), []),
      id: 'completed-tab',
    },
    {
      content: 'Failed',
      index: 2,
      onAction: useCallback(() => setSelectedTab(2), []),
      id: 'failed-tab',
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      filter: null,
      shortcut: true,
      pinned: true,
    },
    {
      key: 'tags',
      label: 'Tags',
      filter: null,
      shortcut: true,
      pinned: true,
    },
    {
      key: 'workflows',
      label: 'Workflows',
      filter: null,
      shortcut: true,
      pinned: true,
    },
  ];

  const appliedFilters = [
    ...(statusFilter.length
      ? [{ key: 'status', label: `Status: ${statusFilter.join(', ')}`, onRemove: () => setStatusFilter([]) }]
      : []),
    ...(tagsFilter.length
      ? [{ key: 'tags', label: `Tags: ${tagsFilter.join(', ')}`, onRemove: () => setTagsFilter([]) }]
      : []),
    ...(workflowFilter.length
      ? [{ key: 'workflows', label: `Workflows: ${workflowFilter.join(', ')}`, onRemove: () => setWorkflowFilter([]) }]
      : []),
  ];

  const rowMarkup = RUNS.map(({ id, name, startedAt, action, status }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <BlockStack gap="050">
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {name}
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            {startedAt}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {action}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone="success">{status}</Badge>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page title="Activity">
      <BlockStack gap="400">
        {/* Date range selector */}
        <InlineStack gap="200" blockAlign="center" wrap={false}>
          <Button icon={CalendarIcon} disclosure>
            Last 7 days
          </Button>
          <Text as="span" variant="bodyMd" tone="subdued">
            compared to Dec 21–Dec 27, 2021
          </Text>
        </InlineStack>

        {/* Metric cards */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="400">
          {METRICS.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </InlineGrid>

        {/* Runs table with inline filters */}
        <LegacyCard>
          <IndexFilters
            queryValue={queryValue}
            queryPlaceholder="Filter"
            onQueryChange={setQueryValue}
            onQueryClear={() => setQueryValue('')}
            tabs={tabs}
            selected={selectedTab}
            onSelect={setSelectedTab}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={() => {
              setStatusFilter([]);
              setTagsFilter([]);
              setWorkflowFilter([]);
              setQueryValue('');
            }}
            mode={mode}
            setMode={setMode}
            canCreateNewView={false}
          />

          <div style={{ padding: 'var(--p-space-400) var(--p-space-400) 0' }}>
            <Text as="p" variant="bodyMd" fontWeight="semibold">
              Showing {RUNS.length} workflows runs
            </Text>
          </div>

          <IndexTable
            resourceName={resourceName}
            itemCount={RUNS.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            selectable={false}
            headings={[
              { title: 'Name', hidden: true },
              { title: 'Action', hidden: true },
              { title: 'Status', hidden: true },
            ]}
          >
            {rowMarkup}
          </IndexTable>

          <div
            style={{
              padding: 'var(--p-space-300) var(--p-space-400)',
              borderTop: 'var(--p-border-width-025) solid var(--p-color-border-secondary)',
            }}
          >
            <InlineStack align="space-between" blockAlign="center">
              <Text as="span" variant="bodyMd" tone="subdued">
                Page {currentPage} of {totalPages}
              </Text>
              <Pagination
                hasPrevious={currentPage > 1}
                onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                hasNext={currentPage < totalPages}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </InlineStack>
          </div>
        </LegacyCard>
      </BlockStack>
    </Page>
  );
}

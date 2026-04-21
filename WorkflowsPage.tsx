import React, { useState, useCallback } from 'react';
import {
  Page,
  LegacyCard,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  Badge,
  Button,
  ButtonGroup,
  InlineStack,
  BlockStack,
  Pagination,
} from '@shopify/polaris';

type WorkflowItem = {
  id: string;
  name: string;
  status: 'Draft' | 'Published';
  createdAt: string;
};

const ITEMS: WorkflowItem[] = [
  { id: '1', name: 'Untitled', status: 'Draft', createdAt: 'Content' },
  { id: '2', name: 'Untitled', status: 'Published', createdAt: 'Content' },
];

const STATUS_BADGE: Record<WorkflowItem['status'], JSX.Element> = {
  Draft: <Badge tone="attention">Draft</Badge>,
  Published: <Badge tone="success">Published</Badge>,
};

export default function WorkflowsPage() {
  const [activeTopTab, setActiveTopTab] = useState<'workflows' | 'functions'>('functions');
  const [selectedFilterTab, setSelectedFilterTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { mode, setMode } = useSetIndexFiltersMode();

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(ITEMS);

  const filterTabs = [
    {
      content: 'All',
      index: 0,
      onAction: useCallback(() => setSelectedFilterTab(0), []),
      id: 'all-tab',
      isLocked: true,
    },
    {
      content: 'On',
      index: 1,
      onAction: useCallback(() => setSelectedFilterTab(1), []),
      id: 'on-tab',
    },
    {
      content: 'Off',
      index: 2,
      onAction: useCallback(() => setSelectedFilterTab(2), []),
      id: 'off-tab',
    },
  ];

  const rowMarkup = ITEMS.map(({ id, name, status, createdAt }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{STATUS_BADGE[status]}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {createdAt}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <BlockStack gap="400">
        {/* Top navigation bar */}
        <InlineStack align="space-between" blockAlign="center">
          <ButtonGroup variant="segmented">
            <Button
              pressed={activeTopTab === 'workflows'}
              onClick={() => setActiveTopTab('workflows')}
            >
              Workflows
            </Button>
            <Button
              pressed={activeTopTab === 'functions'}
              onClick={() => setActiveTopTab('functions')}
            >
              Functions
            </Button>
          </ButtonGroup>

          <Button disclosure>Create new</Button>
        </InlineStack>

        {/* Table card with inline filters */}
        <LegacyCard>
          <IndexFilters
            tabs={filterTabs}
            selected={selectedFilterTab}
            onSelect={setSelectedFilterTab}
            filters={[]}
            onQueryChange={() => {}}
            onQueryClear={() => {}}
            onClearAll={() => {}}
            mode={mode}
            setMode={setMode}
            queryValue=""
          />
          <IndexTable
            resourceName={{ singular: 'item', plural: 'items' }}
            itemCount={ITEMS.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Name' },
              { title: 'Status' },
              { title: 'Created at' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>

        {/* Pagination */}
        <InlineStack align="end">
          <Pagination
            hasPrevious={currentPage > 1}
            onPrevious={() => setCurrentPage((p) => p - 1)}
            hasNext={currentPage < 2}
            onNext={() => setCurrentPage((p) => p + 1)}
            label="1-10 of 12"
          />
        </InlineStack>
      </BlockStack>
    </Page>
  );
}

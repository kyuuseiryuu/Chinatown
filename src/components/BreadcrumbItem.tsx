import styled from 'styled-components';
import { Breadcrumb } from 'antd';

const BreadcrumbItem = styled(Breadcrumb.Item)`
  &.ant-breadcrumb-link {
    cursor: pointer;
  }
`;

export default BreadcrumbItem;


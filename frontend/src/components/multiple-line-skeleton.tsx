import { Box, Skeleton, type SkeletonProps } from '@chakra-ui/react';

const MultipleLineSkeleton: React.FC<SkeletonProps & { lines: number }> = ({ lines, ...props }) => {
    const skeletonLines = Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} {...props} css={{ animationDelay: `${index * 0.1}s` }}>
            ...
        </Skeleton>
    ));
    return <>{skeletonLines}</>;
};

export default MultipleLineSkeleton;

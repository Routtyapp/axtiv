import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { Flex } from '@radix-ui/themes'
import { Spinner } from '../ui'
import { Container } from '../layout'

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Container>
        <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
          <Spinner size="3" text="인증 확인 중..." />
        </Flex>
      </Container>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
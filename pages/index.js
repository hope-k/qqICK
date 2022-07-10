import HomePage from "../components/HomePage"
import Layout from "../components/Layout"
export default function Home() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const token  = req.cookies.token
  // redirect to chat page if token is present
  if (token) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false
      }
    }
  }
  return {
    props: { }
  }
  

}
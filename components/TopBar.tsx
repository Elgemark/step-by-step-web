import Link from 'next/link'
import { AppBar,Toolbar,Button } from '@mui/material'


const TopBar = () => {
    return <AppBar >
        <Toolbar>
            <Button color="inherit">Homes</Button>
        <Link href="/home"><Button color="inherit">Home</Button></Link>
            <Link href="/create">Create</Link>
        </Toolbar>
    </AppBar>
}

export default TopBar